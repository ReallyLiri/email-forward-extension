import { FieldErrors, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FieldError } from "react-hook-form/dist/types/errors";
import { Dispatch, SetStateAction, useEffect } from "react";
import { RECIPIENT_TYPE_TO_DISPLAY_NAME, TO_TYPE_TO_DISPLAY_NAME } from "../util/displays";
import styled, { css } from "styled-components";
import { NormalText, SubTitle } from "./Text";
import { COLOR_DARK, COLOR_SUCCESS, COLOR_ERROR } from "./theme";
import { Configuration, RecipientType, ToType } from "../../../common/configuration";

const TYPES_WITH_EXPLICIT_LIST = new Set<ToType>([ToType.EveryoneExceptFor, ToType.NoOneExceptFor])

type SelectProps = {
  name: string,
  register: any,
  mapping: Record<string, string>
}

const FormStyle = css`
  margin-top: 6px;
`

const StyledSelect = styled.select`
  ${ FormStyle };
  height: 27px;
  display: block;
  cursor: pointer;
`

const DropDown = ({name, register, mapping}: SelectProps) => {
  return <StyledSelect { ...register(name) }>
    {
      Object.keys(mapping).map(toType =>
        <option key={ toType } value={ toType }>{ mapping[toType] }</option>
      )
    }
  </StyledSelect>
}

const StyledInput = styled.input`
  width: 30%;
  ${ FormStyle };
  padding: 4px;
  text-overflow: ellipsis;
  color: ${ COLOR_DARK };
`

const EmailsListBox = styled.textarea`
  ${ FormStyle };
  font-family: unset;
  width: 60%;
  height: 80px;
  overflow: auto;
  padding: 4px;
`

const Form = styled.form`
  display: block;
`

const OptionTitle = styled.div`
  ${ SubTitle };
  font-size: 14px;
  color: ${ COLOR_DARK };
  margin-top: 12px;
`

const HorizontalStack = styled.div`
  display: flex;
  justify-content: left;
  align-items: baseline;

  > :not(:last-child) {
    margin-right: 8px;
  }
`

const Submit = styled.input`
  background-color: #155FFF;
  box-shadow: rgb(0, 0, 0, 9%) 0 2px 4px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  height: 34px;
  padding: 10px;
  width: 100px;
  border-radius: 4px;
  border: unset;
  cursor: pointer;
  margin-top: 16px;
`

const Error = styled.div`
  font-size: 12px;
  color: ${ COLOR_ERROR };
  margin-top: 4px;
`

type OnErrorProps = { errors: FieldErrors, name: string }
const OnError = ({errors, name}: OnErrorProps) => {
  const fieldError = errors[name]
  return fieldError ? <Error>{ (fieldError as FieldError).message }</Error> : <></>;
}

const SaveSuccess = styled.div`
  ${ NormalText };
  margin-left: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${ COLOR_SUCCESS };
`

const validateEmailsLis = async (values: string[]): Promise<boolean> =>
  (await Promise.all((values).map(
    async value => await yup.string().email().isValid(value)
  ))).every(b => b);

const validateEmailsListIfRelevant = async (values: string[] | undefined, context: yup.TestContext): Promise<boolean> =>
  !TYPES_WITH_EXPLICIT_LIST.has(context.parent.toType) || (
    !!values && values.length > 0 &&
    await validateEmailsLis(values)
  );

const emailValueValidator = (_: any) => "Please provide a valid email address";
const emailRequiredValidator = (_: any) => "An email address is required";

const splitCommaSeparated = (list: string | string[]) => {
  return Array.isArray(list)
    ? list
    : list
      ?.split(/[\s,]+/)
      .filter(value => value && value.length > 0)
      .map(value => value.toLowerCase())
    || [];
}

const SCHEMA = yup.object<Record<keyof Configuration, yup.AnySchema>>({
  from: yup.string().email(emailValueValidator).required(emailRequiredValidator),
  toType: yup.string().oneOf(Object.keys(ToType)).required(),
  toExplicitList: yup.array()
    .transform((_, value) => splitCommaSeparated(value))
    .test(
      "toExplicitList",
      "Please list one or more valid email addresses (comma-separated)",
      async (value, context) => await validateEmailsListIfRelevant(value, context)
    )
    .of(yup.string().email()),
  recipientType: yup.string().oneOf(Object.keys(RecipientType)).required(),
  destination: yup.string().email(emailValueValidator).required(emailRequiredValidator),
  inbox: yup.string().test(
    "inbox",
    "Please specify a valid inbox value",
    async value => !value || await yup.string().email().isValid(`${ value }@test.com`)
  )
}).required();

type ConfigurationFormProps = {
  loadedConfiguration: Partial<Configuration>,
  submitConfigurationAsync: (configuration: Configuration) => Promise<void>,
  showSaved: boolean,
  setShowSaved: Dispatch<SetStateAction<boolean>>
}
export const ConfigurationForm = ({loadedConfiguration, submitConfigurationAsync, showSaved, setShowSaved, ...props}: ConfigurationFormProps) => {
  const {register, handleSubmit, watch, clearErrors, getValues, formState: {errors}} = useForm({
    resolver: yupResolver(SCHEMA),
    reValidateMode: 'onSubmit',
    defaultValues: loadedConfiguration as any
  });

  useEffect(() => {
    const subscription = watch(() => {
      clearErrors();
      setShowSaved(false);
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors, setShowSaved]);

  return (
    <Form
      onSubmit={ handleSubmit(async configuration => {
        await submitConfigurationAsync(configuration as Configuration);
        setShowSaved(true);
      }) }
      { ...props }
    >

      <OptionTitle>When emails are sent from...</OptionTitle>
      <StyledInput { ...register("from") } placeholder="Your work emails address"/>
      <OnError errors={ errors } name="from"/>

      <OptionTitle>To...</OptionTitle>
      <DropDown name="toType" register={ register } mapping={ TO_TYPE_TO_DISPLAY_NAME }/>

      {
        TYPES_WITH_EXPLICIT_LIST.has(getValues("toType")) &&
          <>
              <EmailsListBox { ...register("toExplicitList") } placeholder="Fill in email addresses (comma-separated)"/>
              <OnError errors={ errors } name="toExplicitList"/>
          </>
      }

      <OptionTitle>Then automatically...</OptionTitle>
      <HorizontalStack>
        <DropDown name="recipientType" register={ register } mapping={ RECIPIENT_TYPE_TO_DISPLAY_NAME }/>
        <StyledInput { ...register("destination") } placeholder="Your account destination email"/>
        <StyledInput { ...register("inbox") } placeholder="and optionally a specific inbox"/>
      </HorizontalStack>
      <OnError errors={ errors } name="destination"/>

      <HorizontalStack>
        <Submit type="submit" value="Save Rule" title="Save Rule"/>
        {
          showSaved && <SaveSuccess>Saved!</SaveSuccess>
        }
      </HorizontalStack>
    </Form>
  );
}

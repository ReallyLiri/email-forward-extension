import styled from 'styled-components';
import { useCallback, useEffect, useState } from "react";
import { getConfigurationAsync, setConfigurationAsync } from "../util/storage";
import { BackgroundGradient, BoxStyle, PADDING } from "../components/theme";
import { SubTitle, Title } from "../components/Text";
import { ConfigurationForm } from "../components/ConfigurationForm";
import Loading from "../components/Loading";
import { Configuration, Email } from "../../../common/configuration";
import { error, log } from "../../../common/log";

const Background = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  ${ BackgroundGradient }
`

const MainBox = styled.div`
  position: absolute;
  left: 30%;
  right: 30%;
  top: 10%;
  padding-bottom: ${PADDING}px;
  overflow: auto;
  ${ BoxStyle }
`

const StyledForm = styled(ConfigurationForm)`
  padding: 0 0 0 ${ PADDING }px;
`

const StyledIcon = styled.img`
  height: 64px;
  width: 64px;
  padding-left: ${ PADDING }px;
`

function Options() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [showSaved, setShowSaved] = useState<boolean>(false);
  const [configuration, setConfiguration] = useState<Partial<Configuration>>({});

  useEffect(() => {
    getConfigurationAsync().then((configuration) => {
      if ((!configuration.from || configuration.from.length === 0) && chrome.identity) {
        chrome.identity.getProfileUserInfo(userInfo => {
          log(userInfo);
          configuration = {...configuration, from: userInfo.email as Email};
          setConfiguration(configuration);
          setLoading(false);
        });
      } else {
        setConfiguration(configuration);
        setLoading(false);
      }
    })
      .catch(e => error("loading from storage failed", e))
  }, [setLoading, setConfiguration]);

  const saveConfigurationAsync = useCallback(async (updated: Configuration) => {
    try {
      setLoading(true);
      setConfiguration(updated);
      await setConfigurationAsync(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Background>
      <MainBox>
        {
          isLoading
            ? <Loading/>
            : <>
              <Title>Auto Email Forward</Title>
              <SubTitle>
                Automatically CC/BCC emails according to configured rules.<br/><br/>
              </SubTitle>
            <StyledIcon src="images/icon.png" alt="icon"/>
              <StyledForm
                loadedConfiguration={ configuration }
                submitConfigurationAsync={ async updated => await saveConfigurationAsync(updated) }
                showSaved={ showSaved }
                setShowSaved={ setShowSaved }
              />
            </>
        }
      </MainBox>
    </Background>
  );
}

export default Options;
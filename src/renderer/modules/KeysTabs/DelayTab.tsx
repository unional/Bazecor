import React from "react";
import Styled from "styled-components";
import log from "electron-log/renderer";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { i18n } from "@Renderer/i18n";

import Title from "../../component/Title";
import { RegularButton } from "../../component/Button";
import { CustomRadioCheckBox } from "../../component/Form";

import { IconArrowInBoxUp, IconMediaShuffle } from "../../component/Icon";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
}
.description {
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.styles.macro.descriptionColor};
  flex: 0 0 100%;
  width: 100%;
}
.form-control {
    color: ${({ theme }) => theme.styles.form.inputColor};
    background: ${({ theme }) => theme.styles.form.inputBackgroundColor};
    border-color: ${({ theme }) => theme.styles.form.inputBorderSolid};
    font-weight: 600;
    padding: 16px;
    height: auto;
    &:focus {
        background: ${({ theme }) => theme.styles.form.inputBackgroundColorActive};
        border-color: ${({ theme }) => theme.styles.form.inputBorderActive};
        box-shadow: none;
    }
    margin-bottom: 0;
}
.input-group {
    max-width: 280px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    .input-group-text {
        margin-left: -1px;
        font-weight: 600;
        padding: 16px 18px;
        color: ${({ theme }) => theme.styles.form.inputGroupColor};
        background: ${({ theme }) => theme.styles.form.inputGroupBackground};
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-color: ${({ theme }) => theme.styles.form.inputBorderSolid};
    }

}

.formWrapper {
  display: flex;
  flex: 0 0 100%;
  .customCheckbox + .customCheckbox {
    margin-left: 16px;
  }
}
.inputMax {
  text-align: right;
}
.inputGroupRandom {
  position: relative;
  .inputIcon {
    position: absolute;
    top: 33%;
    left: 95px;
    transform: translate3d(0, -50%, 0);
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 50%;
    z-index: 3;
    background-color: ${({ theme }) => theme.styles.form.inputGroup.background};
  }
  .inputMin {
    border-right-color: transparent;
    &:focus {
      border-right: 1px solid ${({ theme }) => theme.styles.form.inputBorderActive};
    }
  }
  .inputMax {
    border-left-color: transparent;
    &:focus {
      border-left: 1px solid ${({ theme }) => theme.styles.form.inputBorderActive};
    }
  }
  .form-control {
    background-color: ${({ theme }) => theme.styles.form.inputGroup.background};
  }
}
`;

interface DelayTabProps {
  onAddDelay: (value: number, type: number) => void;
  onAddDelayRnd: (valueMin: number, valueMax: number, type: number) => void;
}

interface DelayTabState {
  fixedSelected: boolean;
  fixedValue: number;
  randomValue: { min: number; max: number };
}

class DelayTab extends React.Component<DelayTabProps, DelayTabState> {
  constructor(props: DelayTabProps) {
    super(props);

    this.state = {
      fixedSelected: true,
      fixedValue: 0,
      randomValue: { min: 0, max: 0 },
    };
  }

  setFixedSelected = () => {
    this.setState({ fixedSelected: true });
  };

  setRandomSelected = () => {
    this.setState({ fixedSelected: false });
  };

  updateFixed = (e: React.FormEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    this.setState({ fixedValue: value > 65535 ? 65535 : value });
  };

  updateRandomMin = (e: React.FormEvent<HTMLInputElement>) => {
    const { randomValue } = this.state;
    let valueMin = parseInt(e.currentTarget.value, 10);
    valueMin = valueMin > 65535 ? 65535 : valueMin;
    if (valueMin > randomValue.max) {
      randomValue.max = valueMin;
    }
    randomValue.min = valueMin;
    this.setState({ randomValue });
  };

  updateRandomMax = (e: React.FormEvent<HTMLInputElement>) => {
    const { randomValue } = this.state;
    let valueMax = parseInt(e.currentTarget.value, 10);
    valueMax = valueMax > 65535 ? 65535 : valueMax;
    if (valueMax < randomValue.min) {
      randomValue.min = valueMax;
    }
    randomValue.max = valueMax;
    this.setState({ randomValue });
  };

  addDelay = () => {
    const { fixedSelected, fixedValue, randomValue } = this.state;
    const { onAddDelay, onAddDelayRnd } = this.props;
    log.info("add delay", fixedSelected, fixedValue, randomValue);
    if (fixedSelected) {
      onAddDelay(fixedValue, 2);
    } else {
      onAddDelayRnd(randomValue.min, randomValue.max, 1);
    }
    // clean state
    this.setState({
      fixedSelected: true,
      fixedValue: 0,
      randomValue: { min: 0, max: 0 },
    });
  };

  render() {
    const { fixedSelected, fixedValue, randomValue } = this.state;
    return (
      <Styles>
        <div className="tabContentWrapper">
          <Title text={i18n.editor.macros.delayTabs.title} headingLevel={4} />
          <div className="formWrapper">
            <CustomRadioCheckBox
              label="Fixed value"
              checked={fixedSelected}
              onClick={this.setFixedSelected}
              type="radio"
              name="addDelay"
              id="addFixedDelay"
              className=""
              disabled={false}
              tooltip={undefined}
            />
            <CustomRadioCheckBox
              label="Random value"
              checked={!fixedSelected}
              onClick={this.setRandomSelected}
              type="radio"
              name="addDelay"
              id="addRandomDelay"
              tooltip="You can configure a maximum value and minimum value for each time the macro is executed Bazecor choose a delay between this range."
              className=""
              disabled={false}
            />
          </div>
          <div className="inputsWrapper mt-3">
            {fixedSelected ? (
              <div className="inputGroupFixed">
                <InputGroup>
                  <Form.Control
                    placeholder={i18n.editor.macros.delayTabs.title}
                    min={0}
                    max={65535}
                    type="number"
                    onChange={(e: any) => {
                      this.updateFixed(e);
                    }}
                    value={fixedValue}
                  />
                  <InputGroup.Text>ms</InputGroup.Text>
                </InputGroup>
                <p className="description">{i18n.editor.macros.delayTabs.minMaxDescription}</p>
              </div>
            ) : (
              <div className="inputGroupRandom">
                <InputGroup>
                  <Form.Control
                    className="inputMin"
                    placeholder="Min."
                    min={0}
                    type="number"
                    onChange={(e: any) => {
                      this.updateRandomMin(e);
                    }}
                    value={randomValue.min}
                  />
                  <Form.Control
                    className="inputMax"
                    placeholder="Max"
                    min={1}
                    type="number"
                    onChange={(e: any) => {
                      this.updateRandomMax(e);
                    }}
                    value={randomValue.max}
                  />
                  <InputGroup.Text>ms</InputGroup.Text>
                </InputGroup>
                <div className="inputIcon">
                  <IconMediaShuffle />
                </div>
                <p className="description">{i18n.editor.macros.delayTabs.minMaxDescription}</p>
              </div>
            )}
          </div>
        </div>
        <div className="tabSaveButton">
          <RegularButton
            buttonText={i18n.editor.macros.textTabs.buttonText}
            styles="outline gradient"
            onClick={this.addDelay}
            icoSVG={<IconArrowInBoxUp />}
            icoPosition="right"
          />
        </div>
      </Styles>
    );
  }
}

export default DelayTab;

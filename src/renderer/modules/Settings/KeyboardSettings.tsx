// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from "react";
import Styled from "styled-components";

// External components
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Slider from "@appigram/react-rangeslider";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import { KBDataPref } from "@Renderer/types/preferences";
import { IconTypo, IconMouse } from "@Renderer/component/Icon";
import Title from "@Renderer/component/Title";

// Assets
import { i18n } from "@Renderer/i18n";

const Styles = Styled.div`

  .slider{
    width: 100%;
  }
  .greytext{
    color: ${({ theme }) => theme.colors.button.background};
  }
  .dropdownMenu{
    position: absolute;
  }
  .overflowFix{
    overflow: inherit;
  }
  .overflowFix::-webkit-scrollbar {
    display: none;
  }
  .dygmaLogo {
    height: 26px;
    width: 26px;
    margin-right 0.5em;
  }
  .fullWidth {
    button {
      width: -webkit-fill-available;
    }
  }
  .va3fix {
    vertical-align: -3px;
  }
  .va2fix {
    vertical-align: -2px;
  }
  .va1fix {
    vertical-align: -1px;
  }
  .backupbuttons {
    margin: 0;
    padding: 0.44em;
    width: -webkit-fill-available;
  }
  .devfix {
    display: flex;
    justify-content: space-evenly;
  }
  .modinfo {
    font-size: 1rem;
    margin-left: 0.3em;
    color: ${({ theme }) => theme.colors.tipIcon};
  }
  .save-holder {
    position: fixed;
    height: 40px;
    bottom: 40px;
    right: 40px;
  }
  .select-icon {
    position: absolute;
    left: 8px;
    top: 13px;
    background-color: ${({ theme }) => theme.colors.button.deselected};
    border: 2px solid ${({ theme }) => theme.colors.button.deselected};
    color: ${({ theme }) => theme.colors.button.text};
    font-size: 1.3em;
    border-radius: 4px;
  }
  .delete-icon {
    font-size: 1.5rem;
    vertical-align: text-top;
  }
  .align-left {
    float: right;
    margin-top: 6px;
  }
  .neuronToggler{
    text-align: left;
    line-height: 1.8em;
    letter-spacing: 0.02em;
    button.btn.btn-error {
      line-height: 1.8em;
      float: right;
      :hover {
        background-color: #c75454;
      }
    }
  }
  .neuronName{
    .nTitle span{
      line-height: 2.8rem;
      white-space: nowrap;
    }
    .nControl input{
      margin-top: 5px;
      line-height: 2.3rem;
    }
    .nButton button{
    line-height: 1.7rem;
    }
  }
  .neuron-lh{
    line-height: 2.4rem;
  }
  .deleteButton {
    min-width: 100%;
    :hover {
      color: inherit;
    }
  }
  .successButton {
    min-width: 100%;
  }
  .accSpan {
    cursor: pointer;
  }
`;

interface KeyboardSettingsProps {
  kbData: KBDataPref;
  setKbData: (data: KBDataPref) => void;
  connected: boolean;
}

function KeyboardSettings(props: KeyboardSettingsProps) {
  const { kbData, setKbData, connected } = props;
  const [localKBData, setLocalKBData] = useState(kbData);

  useEffect(() => {
    const { kbData: newKBData } = props;
    setLocalKBData(newKBData);
  }, [props, setKbData]);

  const setHoldTimeout = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      qukeysHoldTimeout: value,
    }));
    setKbData({ ...localKBData, qukeysHoldTimeout: value });
  };

  const setOverlapThreshold = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      qukeysOverlapThreshold: value,
    }));
    setKbData({ ...localKBData, qukeysOverlapThreshold: value });
  };

  const setMinHold = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      qukeysMinHold: value,
    }));
    setKbData({ ...localKBData, qukeysMinHold: value });
  };

  const setMinPrior = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      qukeysMinPrior: value,
    }));
    setKbData({ ...localKBData, qukeysMinPrior: value });
  };

  const setSuperTimeout = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      SuperTimeout: value,
    }));
    setKbData({ ...localKBData, SuperTimeout: value });
  };

  const setSuperHoldstart = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      SuperHoldstart: value,
    }));
    setKbData({ ...localKBData, SuperHoldstart: value });
  };

  const setSuperOverlapThreshold = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      SuperOverlapThreshold: value,
    }));
    setKbData({
      ...localKBData,
      SuperOverlapThreshold: value,
    });
  };

  const setSpeed = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      mouseSpeed: value,
      mouseSpeedDelay: 10,
    }));
    setKbData({ ...localKBData, mouseSpeed: value, mouseSpeedDelay: 10 });
  };

  const setAccelSpeed = async (value: number) => {
    setLocalKBData(data => ({
      ...data,
      mouseAccelSpeed: value,
      mouseAccelDelay: 600,
    }));
    setKbData({ ...localKBData, mouseAccelSpeed: value, mouseAccelDelay: 600 });
  };

  const setWheelSpeed = async (value: number) => {
    setLocalKBData(data => ({
      ...data,
      mouseWheelSpeed: value,
      mouseWheelDelay: 100,
    }));
    setKbData({ ...localKBData, mouseWheelSpeed: value, mouseWheelDelay: 100 });
  };

  const setSpeedLimit = async (value: number) => {
    setLocalKBData(data => ({
      ...data,
      mouseSpeedLimit: value,
    }));
    setKbData({ ...localKBData, mouseSpeedLimit: value });
  };

  const {
    qukeysHoldTimeout,
    qukeysOverlapThreshold,
    qukeysMinHold,
    qukeysMinPrior,
    SuperTimeout,
    SuperHoldstart,
    SuperOverlapThreshold,
    mouseSpeed,
    mouseAccelSpeed,
    mouseWheelSpeed,
    mouseSpeedLimit,
  } = localKBData;

  const mSpeed = (
    <Row>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Slow</span>
      </Col>
      <Col xs={8} md={10} className="px-2">
        <Slider min={0} max={127} value={mouseSpeed} onChange={setSpeed} />
      </Col>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Fast</span>
      </Col>
    </Row>
  );

  const mAccelS = (
    <Row>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Slow</span>
      </Col>
      <Col xs={8} md={10} className="px-2">
        <Slider min={0} max={254} value={mouseAccelSpeed} onChange={setAccelSpeed} />
      </Col>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Fast</span>
      </Col>
    </Row>
  );

  const mWheelS = (
    <Row>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Slow</span>
      </Col>
      <Col xs={8} md={10} className="px-2">
        <Slider min={1} max={15} value={mouseWheelSpeed} onChange={setWheelSpeed} />
      </Col>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Fast</span>
      </Col>
    </Row>
  );

  const mSpeedL = (
    <Row>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Slow</span>
      </Col>
      <Col xs={8} md={10} className="px-2">
        <Slider min={0} max={255} value={mouseSpeedLimit} onChange={setSpeedLimit} />
      </Col>
      <Col xs={2} md={1} className="p-0 text-center align-self-center">
        <span className="tagsfix">Fast</span>
      </Col>
    </Row>
  );

  if (connected) {
    return (
      <Styles>
        <Card className="max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle>
              <IconTypo /> {i18n.keyboardSettings.superkeys.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qukeysOverlapThreshold >= 0 && (
              <Form.Group controlId="QukeysOverlap" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.qukeys.overlapThreshold}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.qukeys.overlapThresholdTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.qukeys.overlapThresholdTip2}</li><li class="text-left">${i18n.keyboardSettings.qukeys.overlapThresholdTip3}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={0} max={100} value={qukeysOverlapThreshold} onChange={setOverlapThreshold} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {qukeysHoldTimeout >= 0 && (
              <Form.Group controlId="QukeysOverlap" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.qukeys.holdTimeout}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.qukeys.holdTimeoutTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.qukeys.holdTimeoutTip2}</li><li class="text-left">${i18n.keyboardSettings.qukeys.holdTimeoutTip3}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={1} max={255} value={qukeysHoldTimeout} onChange={setHoldTimeout} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {qukeysMinHold >= 0 && (
              <Form.Group controlId="QukeysMinHold" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.qukeys.minHold}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.qukeys.minHoldTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.qukeys.minHoldTip2}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={1} max={254} value={qukeysMinHold} onChange={setMinHold} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {qukeysMinPrior >= 0 && (
              <Form.Group controlId="QukeysMinHold" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.qukeys.minPrior}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.qukeys.minPriorTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.qukeys.minPriorTip2}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={1} max={254} value={qukeysMinPrior} onChange={setMinPrior} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {SuperOverlapThreshold >= 0 && (
              <Form.Group controlId="SuperOverlap" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.superkeys.overlap}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.superkeys.overlapTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.superkeys.overlapTip2}</li><li class="text-left">${i18n.keyboardSettings.superkeys.overlapTip3}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={0} max={80} value={SuperOverlapThreshold} onChange={setSuperOverlapThreshold} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {SuperTimeout >= 0 && (
              <Form.Group controlId="superTimeout" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.superkeys.timeout}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.superkeys.timeoutTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.superkeys.timeoutTip2}</li><li class="text-left">${i18n.keyboardSettings.superkeys.timeoutTip3}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={1} max={500} value={SuperTimeout} onChange={setSuperTimeout} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
            {SuperHoldstart >= 0 && (
              <Form.Group controlId="superHoldstart" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>
                      <Title
                        text={i18n.keyboardSettings.superkeys.holdstart}
                        headingLevel={6}
                        tooltip={`<h5 class="text-left">${i18n.keyboardSettings.superkeys.chordingTip1}</h5><ul><li class="text-left">${i18n.keyboardSettings.superkeys.chordingTip2}</li><li class="text-left">${i18n.keyboardSettings.superkeys.chordingTip3}</li></ul>`}
                        tooltipPlacement="bottom"
                        tooltipSize="wide"
                      />
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">Less</span>
                  </Col>
                  <Col xs={8} md={10} className="px-2">
                    <Slider min={120} max={500} value={SuperHoldstart} onChange={setSuperHoldstart} />
                  </Col>
                  <Col xs={2} md={1} className="p-0 text-center align-self-center">
                    <span className="tagsfix">More</span>
                  </Col>
                </Row>
              </Form.Group>
            )}
          </CardContent>
        </Card>
        <Card className="mt-3 max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle>
              <IconMouse /> {i18n.keyboardSettings.mouse.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            {mouseSpeed >= 0 && (
              <Form.Group controlId="mouseSpeed" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>{i18n.keyboardSettings.mouse.speed}</Form.Label>
                  </Col>
                </Row>
                {mSpeed}
              </Form.Group>
            )}
            {mouseAccelSpeed >= 0 && (
              <Form.Group controlId="mousemAccelS" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>{i18n.keyboardSettings.mouse.accelSpeed}</Form.Label>
                  </Col>
                </Row>
                {mAccelS}
              </Form.Group>
            )}
            {mouseSpeedLimit >= 0 && (
              <Form.Group controlId="mouseSpeedL" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>{i18n.keyboardSettings.mouse.speedLimit}</Form.Label>
                  </Col>
                </Row>
                {mSpeedL}
              </Form.Group>
            )}
            {mouseWheelSpeed >= 0 && (
              <Form.Group controlId="mousemWheelS" className="formGroup">
                <Row>
                  <Col>
                    <Form.Label>{i18n.keyboardSettings.mouse.wheelSpeed}</Form.Label>
                  </Col>
                </Row>
                {mWheelS}
              </Form.Group>
            )}
          </CardContent>
        </Card>
      </Styles>
    );
  }
}

export { KeyboardSettings };

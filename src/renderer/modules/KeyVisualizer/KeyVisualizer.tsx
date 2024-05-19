// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
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

import React from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";
import { SegmentedKeyType } from "@Renderer/types/layout";
import Title from "../../component/Title";

import ListModifiers from "../../component/ListModifiers/ListModifiers";

const Style = Styled.div`
&.KeyVisualizer {
    padding: 16px;
    position: relative;
    h4 {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.purple200};
        margin-top: 8px;
    }
    .keySelectedBox {
        padding: 16px;
        background: ${({ theme }) => theme.styles.keyVisualizer.background};
        border: ${({ theme }) => theme.styles.keyVisualizer.border};
        box-sizing: border-box;
        box-shadow: ${({ theme }) => theme.styles.keyVisualizer.boxShadow};
        border-radius: 4px;
        width: 132px;
        height:82px;
    }
    .listModifiersTags {
      position: relative;
      margin: 5px -46px 0 -5px;
      display: flex;
      flex-wrap: wrap;
    }

    .labelHyper,
    .labelMeh {
      display: none;
    }
    .hyper-active {
      .labelShift,
      .labelCrtl,
      .labelAlt,
      .labelOs {
        display: none;
      }
      .labelHyper {
        display: inline-block;
      }
    }
    .meh-active {
      .labelShift,
      .labelCrtl,
      .labelAlt {
        display: none;
      }
      .labelMeh {
        display: inline-block;
      }
    }
    .oldKeyValue {
      margin-bottom: 24px;
      h4 {
          color: ${({ theme }) => theme.styles.keyVisualizer.color};
          strong {
            text-transform: uppercase;
            color: ${({ theme }) => theme.styles.keyVisualizer.colorSuperkeyAction};
            font-weight: 600;
          }
      }
      .keySelectedBox {
          padding: 8px 16px;
          border: 2px solid ${({ theme }) => theme.styles.keyVisualizer.borderOldValue};
          box-shadow: none;
          width: 104px;
          height:52px;
          font-size: 12px;
      }
    }
    .showConnection {
      position: relative;
    }
    .showConnection:before {
      position: absolute;
      content: "";
      top: 40px;
      left: -12px;
      width: 12px;
      height: 128px;
      background-repeat: no-repeat;
      background-image: url(${({ theme }) => theme.styles.keyVisualizer.bgOldToNew});
    }
}

`;

interface KeyVisualizerProps {
  keyCode: number | SegmentedKeyType;
  oldKeyCode: number | SegmentedKeyType;
  newValue: string | JSX.Element;
  oldValue: string | JSX.Element;
  isStandardView: boolean;
  superkeyAction: number;
  disable?: boolean;
}

const KeyVisualizer = (props: KeyVisualizerProps) => {
  const { keyCode, oldKeyCode, newValue, oldValue, isStandardView, superkeyAction, disable } = props;
  const rows = [
    {
      title: `<strong>${i18n.editor.superkeys.actions.tapLabel}:</strong> Selected value`,
    },
    {
      title: `<strong>${i18n.editor.superkeys.actions.holdLabel}:</strong> Selected value`,
    },
    {
      title: `<strong>${i18n.editor.superkeys.actions.tapAndHoldLabel}:</strong> Selected value`,
    },
    {
      title: `<strong>${i18n.editor.superkeys.actions.doubleTapLabel}:</strong> Selected value`,
    },
    {
      title: `<strong>${i18n.editor.superkeys.actions.doubleTapAndHoldLabel}:</strong> Selected value`,
    },
    {
      title: `Selected value`,
    },
  ];

  return (
    <Style className="KeyVisualizer">
      <div
        className={`KeyVisualizerInner ${newValue !== oldValue && isStandardView ? "showConnection" : ""} ${
          disable ? "disable" : ""
        }`}
      >
        {oldValue ? (
          <div className="oldKeyValue">
            <Title text={`${rows ? rows[superkeyAction].title : "Selected value"}`} headingLevel={4} />
            <div className="keySelectedBox">
              <div className="keySelectedValue">{oldValue}</div>
              <ListModifiers
                keyCode={
                  oldKeyCode !== undefined && typeof oldKeyCode !== "number" ? oldKeyCode.base + oldKeyCode.modified : oldKeyCode
                }
                size="sm"
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {newValue && !isStandardView ? (
          <div className="newKeyValue">
            <Title text="New value" headingLevel={4} />
            <div className="keySelectedBox">
              <div className="keySelectedValue">{newValue}</div>
              <ListModifiers
                keyCode={keyCode !== undefined && typeof keyCode !== "number" ? keyCode.base + keyCode.modified : keyCode}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {newValue !== oldValue && isStandardView ? (
          <div className="newKeyValue">
            <Title text="New value" headingLevel={4} />
            <div className="keySelectedBox">
              <div className="keySelectedValue">{newValue}</div>
              <ListModifiers
                keyCode={keyCode !== undefined && typeof keyCode !== "number" ? keyCode.base + keyCode.modified : keyCode}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Style>
  );
};

export default KeyVisualizer;

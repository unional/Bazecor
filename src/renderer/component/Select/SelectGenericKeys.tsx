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
import Dropdown from "react-bootstrap/Dropdown";
import log from "electron-log/renderer";

import { KeymapDB } from "../../../api/keymap";

const Style = Styled.div`
.custom-dropdown {
  .dropdownItem {
    padding-left: 0;
    flex: 0 0 100%;
    text-align: left;
    text-transform: capitalize;
  }
  .dropdownItemSelected {
    color: ${({ theme }) => theme.styles.dropdown.textButtonColor};
    position: relative;
    .badge-circle{
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(254,0,124,1);
        position: absolute;
        right: -2px;
        top: -4px;
        font-size: 11px;
    }
    &:hover {
      color: ${({ theme }) => theme.styles.dropdown.textButtonHover};
    }
  }
}
.dropdown-Fkeys {
    .dropdown-toggle.btn.btn-primary {
        padding: 0;
        border: none;
        margin: 0;

    }
    .dropdown-toggle::after {
        content: none;
    }
}
.disabled {
  pointer-events: none;
  opacity: 35%;
}
`;

function SelectGenericKeys(props: any) {
  const { keyCode, onSelect, value, listElements, content, disabled } = props;
  const [load, setLoad] = React.useState(true);
  const contentWidth = 200;
  const keymapDB = new KeymapDB();

  const labelKey = (id: number) => {
    const aux = keymapDB.parse(id);
    return aux.label;
  };

  React.useEffect(() => {
    if (content !== undefined) {
      log.verbose("keyCode: ", keyCode);
      setLoad(false);
    }
  }, [content, value, keyCode]);

  if (load) return null;
  return (
    <Style>
      <Dropdown
        onSelect={val => onSelect(parseInt(val, 10))}
        drop="down"
        flip={false}
        className={`custom-dropdown dropdown-Fkeys ${disabled ? "disabled" : ""}`}
      >
        <Dropdown.Toggle id="dropdown-generic">
          <div className="dropdownItemSelected">
            <svg width={contentWidth} height={26}>
              <g filter="url(#filter0_d_2211_181319)">
                <rect x={0} y={0} width={contentWidth} height={26} rx="5" className="baseKey baseKeyDropdown" />
              </g>
              <rect x={0} y={0} width={contentWidth} height={26} rx="5" fill="url(#paint_gradient)" fillOpacity={0.1} />
              <g width="12" height="12" fill="transparent">
                <path
                  d="M1.5 3.5L6 8L10.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  transform={`translate(${contentWidth - 22}, ${6})`}
                />
              </g>
              <text x={4} y={16} fontSize={13} fill="white" fontWeight={600} textAnchor="left">
                {content.first}
              </text>
            </svg>
            <div className="badge-circle" />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu flip={false}>
          {listElements.map((item: any, index: number) => (
            <Dropdown.Item
              eventKey={item}
              // eslint-disable-next-line react/no-array-index-key
              key={`genericKeys-${index}`}
              className={`${keyCode.base && keyCode.base === item ? "active" : ""}`}
              pointerEvents="all"
            >
              <div className="dropdownInner">
                <div className="dropdownItem">{labelKey(item)}</div>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Style>
  );
}

export default SelectGenericKeys;

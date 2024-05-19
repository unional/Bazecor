/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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

import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import log from "electron-log/renderer";
import { Octokit } from "@octokit/core";
import SemVer from "semver";

import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import Styled from "styled-components";

import DygmaLogo from "@Assets/logo.svg";
import { showDevtools } from "@Renderer/devMode";
import { useDevice } from "@Renderer/DeviceContext";
import { AlertModal } from "@Renderer/component/Modal";
import { BatteryStatus } from "@Renderer/modules/Battery";
import { NavigationButton } from "@Renderer/component/Button";
import { i18n } from "@Renderer/i18n";

// Types
import Version from "@Types/version";
import { DygmaDeviceType } from "@Renderer/types/devices";
import { NavigationMenuProps } from "@Renderer/types/navigation";

import {
  IconKeyboardSelector,
  IconKeyboard2Stroke,
  IconMemory2Stroke,
  IconRobot2Stroke,
  IconThunder2Stroke,
  IconPreferences2Stroke,
  IconBazecordevtools,
} from "../../component/Icon";

const Styles = Styled.div`
.disabled {
  pointer-events: none;
}
.brand-image {
  margin: 20px 0 32px 0;
  padding: 0 !important;
  display: block;
  width: 100%;
  text-align: center;
  -webkit-app-region: drag;
  img {
    display: block;
    margin: 0 auto;
    width: 42px;
    aspect-ratio: 1;
  }
}
.left-navbar {
  width: var(--sidebarWidth);
  height: 100%;
  position: fixed !important;
  z-index: 1100;
  padding: 12px !important;
  background-color: ${({ theme }) => theme.styles.navbar.background};
  display: flex;
  flex-direction: column;
  .navbar-nav {
    flex-wrap: wrap;
    height: inherit;
    .bottomMenu {
      margin-top: auto;
    }
    .topMenu,
    .bottomMenu {
      width: 100%;
    }
  }
}
.list-link {
  display: flex;
  &:hover {
    text-decoration: none;
  }
}
.list-link+.list-link {
  margin-top: 8px;
}
.select {
  background-color: ${({ theme }) => theme.card.backgroundActive};
  border-radius: 8px;
  width: 100%;
}
`;

function NavigationMenu(props: NavigationMenuProps) {
  const { state } = useDevice();

  const [checkedVer, setCheckedVer] = useState(false);
  const [versions, setVersions] = useState(null);
  const [isUpdated, setIsUpdated] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [device, setDevice] = useState<Record<string, DygmaDeviceType>>({});
  const [virtual, setVirtual] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;
  const { connected, pages, fwUpdate, flashing, allowBeta, modified, loading } = props;

  const getGitHubFW = useCallback(
    async (product: any) => {
      const releases: any[] = [];
      const octokit = new Octokit();
      const data = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner: "Dygmalab",
        repo: "Firmware-release",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      data.data.forEach(release => {
        const releaseData = release.name.split(" ");
        const newRelease = { name: releaseData[0], version: releaseData[1] };
        if (!releaseData[1].includes("beta") || allowBeta) releases.push(newRelease);
      });
      const finalReleases = releases.filter(release => release.name === product);
      finalReleases.sort((a, b) => (SemVer.lt(SemVer.clean(a.version), SemVer.clean(b.version)) ? 1 : -1));
      // log.info("data retrieved: ", finalReleases);
      return finalReleases;
    },
    [allowBeta],
  );

  const checkKeyboardMetadata = useCallback(async () => {
    setIsUpdated(true);
    setDevice(state.currentDevice.device);
    if (state.currentDevice.device === undefined || state.currentDevice.device.bootloader) return;
    let parts = await state.currentDevice.command("version");
    parts = parts.split(" ");
    const getVersions: Version = {
      bazecor: parts[0],
      kaleidoscope: parts[1],
      firmware: parts[2],
    };
    let Beta = getVersions.bazecor.includes("beta");
    let cleanedVersion = getVersions.bazecor;
    if (Beta && !getVersions.bazecor.includes("-beta")) cleanedVersion = getVersions.bazecor.replace("beta", "");
    // Getting GitHub Data
    let fwList = [];
    try {
      fwList = await getGitHubFW(state.currentDevice.device.info.product);
    } catch (error) {
      log.info("Error when fetching GitHub data");
      log.warn(error);
      fwList = [{ version: cleanedVersion }];
    }
    // Comparing online Data to FW version
    const semVerCheck = fwList.length > 0 ? SemVer.compare(fwList[0].version, cleanedVersion) : 0;
    Beta = Beta || state.currentDevice.device.info.product !== "Raise";
    setVersions(getVersions);
    setIsUpdated(semVerCheck !== 1);
    setIsBeta(Beta);
    setVirtual(state.currentDevice.file);
    setCheckedVer(true);
  }, [getGitHubFW, state.currentDevice]);

  useEffect(() => {
    if (!flashing && connected && !loading && !checkedVer) {
      checkKeyboardMetadata();
    }
  }, [flashing, connected, loading, checkKeyboardMetadata, checkedVer]);

  useEffect(() => {
    if (checkedVer && !connected) {
      setCheckedVer(false);
    }
  }, [checkedVer, connected]);

  const [showAlertModal, setShowAlertModal] = useState(false);

  function linkHandler(event: React.MouseEvent<HTMLElement>) {
    if (modified) {
      event.preventDefault();
      setShowAlertModal(true);
      // alert("you have pending changes! save or discard them before leaving.");
    }
  }
  return (
    <Styles>
      <Navbar
        className={`left-navbar sidebar ${
          connected &&
          device &&
          state.currentDevice.device.info &&
          (state.currentDevice.device.info.keyboardType === "wireless" || state.currentDevice.device.wireless) &&
          versions !== null
            ? "isWireless"
            : "wired"
        }`}
        sticky="top"
      >
        <NavbarBrand as={Link} onClick={linkHandler} to="/" className="brand-image d-lg-block">
          <img alt="" src={DygmaLogo} className="d-inline-block align-top" />
        </NavbarBrand>
        <Nav>
          <div className="topMenu">
            {connected && (
              <>
                {pages.keymap && (
                  <>
                    <Link to="/editor" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/editor"}
                        buttonText={i18n.app.menu.editor}
                        icoSVG={<IconKeyboard2Stroke />}
                        disabled={fwUpdate || loading}
                      />
                    </Link>
                    <Link to="/macros" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
                      <NavigationButton
                        selected={currentPage === "/macros"}
                        buttonText={i18n.app.menu.macros}
                        icoSVG={<IconRobot2Stroke />}
                        disabled={fwUpdate || loading}
                      />
                    </Link>
                    <Link
                      to="/superkeys"
                      onClick={linkHandler}
                      className={`list-link ${fwUpdate || !isBeta || loading ? "disabled" : ""}`}
                    >
                      <NavigationButton
                        selected={currentPage === "/superkeys"}
                        buttonText={i18n.app.menu.superkeys}
                        icoSVG={<IconThunder2Stroke />}
                        showNotif={isBeta}
                        notifText="BETA"
                        disabled={fwUpdate || !isBeta || loading}
                      />
                    </Link>
                  </>
                )}
                <Link
                  to="/firmware-update"
                  onClick={linkHandler}
                  className={`list-link ${
                    fwUpdate || virtual || state.currentDevice.type === "hid" || loading ? "disabled" : ""
                  }`}
                >
                  <NavigationButton
                    selected={currentPage === "/firmware-update"}
                    showNotif={!isUpdated}
                    buttonText={i18n.app.menu.firmwareUpdate}
                    icoSVG={<IconMemory2Stroke />}
                    disabled={fwUpdate || virtual || state.currentDevice.type === "hid" || loading}
                  />
                </Link>
              </>
            )}
            <Link to="/keyboard-select" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/keyboard-select"}
                buttonText={i18n.app.menu.selectAKeyboard}
                icoSVG={<IconKeyboardSelector />}
                disabled={fwUpdate || loading}
              />
            </Link>
          </div>
          <div className="bottomMenu">
            {showDevtools && (
              <Link to="/bazecordevtools" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
                <NavigationButton
                  selected={currentPage === "/bazecordevtools"}
                  buttonText="Dev tools"
                  icoSVG={<IconBazecordevtools width={32} height={32} strokeWidth={2} />}
                  disabled={fwUpdate || loading}
                />
              </Link>
            )}
            <Link to="/preferences" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
              <NavigationButton
                selected={currentPage === "/preferences"}
                buttonText={i18n.app.menu.preferences}
                icoSVG={<IconPreferences2Stroke />}
                disabled={fwUpdate || loading}
              />
            </Link>
            {/* <Link to="/device-manager" className="list-link">
              <NavigationButton
                selected={false}
                showNotif={false}
                buttonText="Device Manager"
                icoSVG={<IconHome />}
                disabled={false}
              />
            </Link> */}
            {connected &&
            state.currentDevice &&
            state.currentDevice.device.info &&
            state.currentDevice.device.info.product !== "Raise" &&
            (state.currentDevice.device.info.keyboardType === "wireless" || state.currentDevice.device.wireless) &&
            versions !== null ? (
              <>
                {/* <Link to="/wireless" onClick={linkHandler} className={`list-link ${fwUpdate || loading ? "disabled" : ""}`}>
                  <NavigationButton
                    selected={currentPage === "/wireless"}
                    buttonText={i18n.app.menu.wireless}
                    icoSVG={<IconWireless width={42} height={42} strokeWidth={2} />}
                    disabled={fwUpdate || loading}
                  />
                </Link> */}
                <BatteryStatus disable={fwUpdate || virtual || loading} />
              </>
            ) : (
              ""
            )}
          </div>
        </Nav>
      </Navbar>
      <AlertModal
        showModal={showAlertModal}
        setShowModal={setShowAlertModal}
        title={i18n.errors.alertUnsavedTitle}
        description={i18n.errors.alertUnsavedDescription}
      />
    </Styles>
  );
}

export default NavigationMenu;

/* eslint-disable no-bitwise */
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2022  DygmaLab SE
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
import { toast } from "react-toastify";
import Styled from "styled-components";

// Styling and elements
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

// Components
import Callout from "@Renderer/component/Callout";
import { LayoutViewSelector } from "@Renderer/component/ToggleButtons";
import { SuperkeysSelector } from "@Renderer/component/Select";
import { RegularButton } from "@Renderer/component/Button";
import { LogoLoaderCentered } from "@Renderer/component/Loader";

import ToastMessage from "@Renderer/component/ToastMessage";
import { IconFloppyDisk } from "@Renderer/component/Icon";

// Modules
import { PageHeader } from "@Renderer/modules/PageHeader";
import { SuperKeysFeatures, SuperkeyActions } from "@Renderer/modules/Superkeys";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";
import StandardView from "@Renderer/modules/StandardView";

// Types
import { SuperkeysEditorInitialStateType, SuperkeysEditorProps } from "@Renderer/types/superkeyseditor";
import { MacrosType } from "@Renderer/types/macros";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { Neuron } from "@Renderer/types/neurons";
import { KeymapType } from "@Renderer/types/layout";

// API's
import { useDevice } from "@Renderer/DeviceContext";
import { i18n } from "@Renderer/i18n";
import Store from "@Renderer/utils/Store";
import getLanguage from "@Renderer/utils/language";
import Keymap, { KeymapDB } from "../../api/keymap";
import Backup from "../../api/backup";

const store = Store.getStore();

const Styles = Styled.div`
&.superkeys {
  display: flex;
  min-height: 100%;
  .layoutSelector {
    margin-left: 15px;
  }
}
height: -webkit-fill-available;
display: flex;
flex-direction: column;
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
  .save-button {
    text-align: center;
  }
  .supercontainer {
    margin-right: auto;
    margin-left: auto;
    margin-top: 0.4rem;
    width: inherit;
  }
.button-large {
  font-size: 2rem;
  width: -webkit-fill-available;
  text-align: left;
}
`;

function SuperkeysEditor(props: SuperkeysEditorProps) {
  let keymapDB = new KeymapDB();
  const bkp = new Backup();
  const [isSaving, setIsSaving] = useState(false);

  const flatten = (arr: unknown[]) => [].concat(...arr);

  const defaultMacro = [
    {
      actions: [
        { keyCode: 229, type: 6, id: 0 },
        { keyCode: 11, type: 8, id: 1 },
        { keyCode: 229, type: 7, id: 2 },
        { keyCode: 8, type: 8, id: 3 },
        { keyCode: 28, type: 8, id: 4 },
        { keyCode: 54, type: 8, id: 5 },
        { keyCode: 44, type: 8, id: 6 },
        { keyCode: 229, type: 6, id: 7 },
        { keyCode: 7, type: 8, id: 8 },
        { keyCode: 229, type: 7, id: 9 },
        { keyCode: 28, type: 8, id: 10 },
        { keyCode: 10, type: 8, id: 11 },
        { keyCode: 16, type: 8, id: 12 },
        { keyCode: 4, type: 8, id: 13 },
        { keyCode: 23, type: 8, id: 14 },
        { keyCode: 8, type: 8, id: 15 },
      ],
      id: 0,
      macro: "RIGHT SHIFT H RIGHT SHIFT E Y , SPACE RIGHT SHIFT D RIGHT SHIFT Y G M A T E",
      name: "Hey, Dygmate!",
    },
  ];

  const initialState: SuperkeysEditorInitialStateType = {
    keymap: undefined,
    macros: [],
    superkeys: [],
    storedMacros: [],
    neurons: [],
    neuronID: "",
    kbtype: "iso",
    maxSuperKeys: 128,
    modified: false,
    modifiedKeymap: false,
    selectedSuper: 0,
    selectedAction: -1,
    showDeleteModal: false,
    listToDelete: [],
    futureSK: [],
    futureSSK: 0,
    currentLanguageLayout: getLanguage(store.get("settings.language") as string),
    isStandardView: store.get("settings.isStandardView") as boolean,
    showStandardView: false,
    loading: true,
  };
  const [state, setState] = useState(initialState);
  const { state: deviceState } = useDevice();

  const handleSaveStandardView = () => {
    state.showStandardView = false;
    state.selectedAction = -1;
    setState({ ...state });
  };

  const onToggle = () => {
    const { isStandardView: isStandardViewSuperkeys } = state;
    if (isStandardViewSuperkeys) {
      state.isStandardView = false;
      state.selectedAction = -1;
      setState({ ...state });
    } else {
      state.isStandardView = true;
      state.selectedAction = -1;
      setState({ ...state });
    }
  };

  const macroTranslator = (raw: string) => {
    const { storedMacros } = state;
    if (typeof raw === "string" && raw.search(" 0 0") === -1) {
      return defaultMacro;
    }
    const macrosArray = raw.split(" 0 0")[0].split(" ").map(Number);

    // Translate received macros to human readable text
    const macros = [];
    let iter = 0;
    // macros are `0` terminated or when end of macrosArray has been reached, the outer loop
    // must cycle once more than the inner
    while (iter <= macrosArray.length) {
      const actions = [];
      while (iter < macrosArray.length) {
        const type = macrosArray[iter];
        if (type === 0) {
          break;
        }

        switch (type) {
          case 1:
            actions.push({
              type,
              keyCode: [
                (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
                (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
              ],
            });
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            actions.push({ type, keyCode: (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)] });
            break;
          case 6:
          case 7:
          case 8:
            actions.push({ type, keyCode: macrosArray[(iter += 1)] });
            break;
          default:
            break;
        }

        iter += 1;
      }
      macros.push({
        actions,
        name: "",
        macro: "",
      });
      iter += 1;
    }
    macros.forEach((m, idx) => {
      const aux: MacrosType = m;
      aux.id = idx;
      macros[idx] = aux;
    });

    // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
    const stored = storedMacros;
    if (stored === undefined || stored.length === 0) {
      return macros;
    }
    return macros.map((macro, i) => {
      if (stored.length < i) {
        return macro;
      }

      return {
        ...macro,
        name: stored[i]?.name,
        macro: macro.actions.map(k => keymapDB.parse(k.keyCode as number).label).join(" "),
      };
    });
  };

  const superTranslator = (raw: string) => {
    const { neurons, neuronID } = state;
    const superArray = raw.split(" 0 0")[0].split(" ").map(Number);

    let superkey: number[] = [];
    const superkeys: SuperkeysType[] = [];
    let iter = 0;
    let superindex = 0;

    if (superArray.length < 1) {
      console.log("Discarded Superkeys due to short length of string", raw, raw.length);
      return [{ actions: [53, 2101, 1077, 41, 0], name: "Welcome to superkeys", id: superindex }];
    }
    // console.log(raw, raw.length);
    while (superArray.length > iter) {
      // console.log(iter, raw[iter], superkey);
      if (superArray[iter] === 0) {
        superkeys[superindex] = { actions: superkey, name: "", id: superindex };
        superindex += 1;
        superkey = [];
      } else {
        superkey.push(superArray[iter]);
      }
      iter += 1;
    }
    superkeys[superindex] = { actions: superkey, name: "", id: superindex };

    if (superkeys[0].actions.length === 0 || superkeys[0].actions.length > 5) {
      console.log(`Superkeys were empty`);
      return [];
    }
    console.log(`Got Superkeys:${JSON.stringify(superkeys)} from ${raw}`);
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let finalSuper: SuperkeysType[] = [];
    const stored = neurons.find(n => n.id === neuronID).superkeys;
    finalSuper = superkeys.map((superky, i) => {
      const superk = superky;
      if (stored.length > i && stored.length > 0) {
        const aux = superk;
        aux.name = stored[i].name;
        return aux;
      }
      return superk;
    });
    console.log("final superkeys", finalSuper);
    return finalSuper;
  };

  useEffect(() => {
    try {
      store.set("settings.isStandardViewSuperkeys", state.isStandardView);
    } catch (error) {
      console.log("error when setting standard view mode", error);
    }
  }, [state.isStandardView]);

  const onKeyChange = (keyCode: number) => {
    const { superkeys, selectedSuper, selectedAction } = state;
    const { startContext } = props;
    const newData = superkeys;
    newData[selectedSuper].actions[selectedAction] = keyCode;
    console.log("keyCode: ", keyCode);
    state.superkeys = newData;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const loadSuperkeys = async () => {
    const { currentDevice } = deviceState;
    const { onDisconnect, setLoading, cancelContext } = props;
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      let chipID = await currentDevice.command("hardware.chip_id");
      chipID = chipID.replace(/\s/g, "");
      const neurons = store.get("neurons") as Neuron[];
      let neuron: Neuron;
      if (neurons.some(n => n.id === chipID)) {
        console.log(neurons.filter(n => n.id === chipID));
        [neuron] = neurons.filter(n => n.id === chipID);
      }
      state.neurons = neurons;
      state.neuronID = chipID;
      state.storedMacros = neuron.macros;
      setState({ ...state });
      const deviceLang = { ...currentDevice.device, language: true };
      currentDevice.commands.keymap = new Keymap(deviceLang);
      keymapDB = currentDevice.commands.keymap.db;
      let kbtype = "iso";
      try {
        kbtype = currentDevice.device && currentDevice.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        return false;
      }
      // Keymap
      const defaults = await currentDevice.command("keymap.default");
      const custom = await currentDevice.command("keymap.custom");
      const onlyCustom = Boolean(parseInt(await currentDevice.command("keymap.onlyCustom"), 10));
      const keymap: KeymapType = { custom: undefined, default: undefined, onlyCustom: false };
      const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;
      keymap.custom = custom
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => keymapDB.parse(parseInt(k, 10)))
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / layerSize);

          if (!resultArray[chunkIndex]) {
            // eslint-disable-next-line no-param-reassign
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      keymap.default = defaults
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => keymapDB.parse(parseInt(k, 10)))
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / layerSize);

          if (!resultArray[chunkIndex]) {
            // eslint-disable-next-line no-param-reassign
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      keymap.onlyCustom = onlyCustom;
      // Macros
      const macrosRaw = await currentDevice.command("macros.map");
      const parsedMacros = macroTranslator(macrosRaw);
      const supersRaw = await currentDevice.command("superkeys.map");
      const parsedSuper = superTranslator(supersRaw);
      state.modified = false;
      state.macros = parsedMacros;
      state.superkeys = parsedSuper;
      state.selectedSuper = 0;
      state.keymap = keymap;
      state.kbtype = kbtype;
      setState({ ...state });
      cancelContext();
      setLoading(false);
    } catch (e) {
      console.log("error when loading SuperKeys");
      console.error(e);
      toast.error(e);
      cancelContext();
      setLoading(false);
      onDisconnect();
    }
    return true;
  };

  const superkeyMap = (superkeys: SuperkeysType[]) => {
    if (
      superkeys.length === 0 ||
      (superkeys.length === 1 && superkeys[0].actions.length === 0) ||
      (superkeys.length === 1 && superkeys[0].actions.length === 1 && superkeys[0].actions[0] === 0)
    ) {
      return Array(512).fill("65535").join(" ");
    }
    let keyMap = JSON.parse(JSON.stringify(superkeys));
    // console.log("First", JSON.stringify(keyMap));
    keyMap = keyMap.map((sky: SuperkeysType) => {
      const sk = sky;
      sk.actions = sk.actions.map(act => {
        if (act === 0 || act === null || act === undefined) return 1;
        return act;
      });
      if (sk.actions.length < 5) sk.actions = sk.actions.concat(Array(5 - sk.actions.length).fill(1));
      return sk;
    });
    // console.log("Third", JSON.parse(JSON.stringify(keyMap)));
    const mapped = keyMap
      .map((superkey: SuperkeysType) => superkey.actions.filter(act => act !== 0).concat([0]))
      .flat()
      .concat([0])
      .join(" ")
      .split(",")
      .join(" ");
    console.log("Mapped superkeys: ", mapped, keyMap);
    return mapped;
  };

  const changeSelected = (id: number) => {
    state.selectedSuper = id < 0 ? 0 : id;
    state.selectedAction = -1;
    setState({ ...state });
  };

  const changeAction = (id: number) => {
    const { isStandardView: isStandardViewSuperkeys, selectedAction } = state;
    if (isStandardViewSuperkeys) {
      state.selectedAction = id < 0 ? 0 : id;
      state.showStandardView = true;
      setState({ ...state });
    } else {
      if (id === selectedAction) {
        // Some action is already selected
        state.selectedAction = -1;
        setState({ ...state });
        return;
      }
      state.selectedAction = id < 0 ? 0 : id;
      state.showStandardView = false;
      setState({ ...state });
    }
  };

  const updateSuper = (newSuper: SuperkeysType[], newID: number) => {
    const { startContext } = props;
    // console.log("launched update super using data:", newSuper, newID);
    state.superkeys = newSuper;
    state.selectedSuper = newID;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const updateAction = (actionNumber: number, newAction: number) => {
    const { startContext } = props;
    const { superkeys, selectedSuper } = state;
    // console.log("launched update action using data:", newAction);
    const newData = superkeys;
    newData[selectedSuper].actions[actionNumber] = newAction;
    state.superkeys = newData;
    state.selectedAction = actionNumber;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const saveName = (name: string) => {
    const { startContext } = props;
    const { superkeys, selectedSuper } = state;
    superkeys[selectedSuper].name = name;
    state.superkeys = superkeys;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const writeSuper = async () => {
    const { setLoading, cancelContext } = props;
    const { superkeys, modifiedKeymap, keymap, neurons, neuronID } = state;
    setIsSaving(true);
    const { currentDevice } = deviceState;
    const localNeurons = [...neurons];
    const nIdx = localNeurons.findIndex(n => n.id === neuronID);
    localNeurons[nIdx].superkeys = superkeys;
    console.log("Loaded neurons: ", JSON.stringify(localNeurons));
    try {
      store.set("neurons", localNeurons);
      await currentDevice.command("superkeys.map", superkeyMap(superkeys));
      if (modifiedKeymap) {
        const args = flatten(keymap.custom)
          .map(k => keymapDB.serialize(k))
          .toString();
        await currentDevice.command("keymap.custom", ...args);
      }
      state.modified = false;
      state.modifiedKeymap = false;
      setState({ ...state });
      console.log("Changes saved.");
      const commands = await Backup.Commands(currentDevice);
      const backup = await bkp.DoBackup(commands, neurons[nIdx].id, currentDevice);
      Backup.SaveBackup(backup, currentDevice);
      toast.success(<ToastMessage title={i18n.editor.superkeys.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
      cancelContext();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      cancelContext();
      setLoading(false);
    }
    setIsSaving(false);
  };

  const toggleDeleteModal = () => {
    state.showDeleteModal = false;
    state.listToDelete = [];
    state.futureSK = [];
    state.futureSSK = 0;
    setState({ ...state });
  };

  const SortSK = (newSuper: SuperkeysType[], newID: number) => {
    const { startContext } = props;
    const { keymap, selectedSuper, superkeys } = state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, sk: key.id + 53980 };
                return undefined;
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    console.log("now decreasing... ", listToDecrease.flat());
    listToDecrease = listToDecrease.flat();
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = keymapDB.parse(listToDecrease[i].sk - 1);
    }
    state.keymap = keymap;
    state.superkeys = newSuper;
    state.selectedSuper = newID;
    state.modified = true;
    state.modifiedKeymap = true;
    setState({ ...state });
    startContext();
    toggleDeleteModal();
  };

  const checkKBSuperkeys = (newSuper: SuperkeysType[], newID: number, SKC: number) => {
    const { keymap, selectedSuper, superkeys } = state;
    let localNewSuper = newSuper;
    let localNewID = newID;
    if (localNewSuper.length === 0) {
      localNewSuper = [{ actions: [53, 2101, 1077, 41, 0], name: "Welcome to superkeys", id: 0 }];
      localNewID = 0;
    }
    const LOK = keymap.custom
      .map((l, c) =>
        l
          .map((k, i) => {
            if (k.keyCode === SKC) return { layer: c, pos: i, superIdx: SKC, newKey: 0 };
            return undefined;
          })
          .filter(x => x !== undefined),
      )
      .flat();
    if (LOK.length > 0) {
      state.showDeleteModal = true;
      state.listToDelete = LOK;
      state.futureSK = localNewSuper;
      state.futureSSK = localNewID;
      setState({ ...state });
    } else if (selectedSuper !== superkeys.length - 1) {
      SortSK(localNewSuper, localNewID);
    } else {
      updateSuper(localNewSuper, localNewID);
    }
  };

  const RemoveDeletedSK = () => {
    const { startContext } = props;
    const { keymap, selectedSuper, superkeys, listToDelete, futureSK, futureSSK } = state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, superIdx: key.id + 53980 };
                return undefined;
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    for (let i = 0; i < listToDelete.length; i += 1) {
      keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(0);
    }
    listToDecrease = listToDecrease.flat();
    console.log("now decreasing... ", listToDecrease);
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = keymapDB.parse(listToDecrease[i].superIdx - 1);
    }
    state.keymap = keymap;
    state.superkeys = futureSK;
    state.selectedSuper = futureSSK;
    state.modified = true;
    state.modifiedKeymap = true;
    setState({ ...state });
    startContext();
    toggleDeleteModal();
  };

  // Manage Standard/Single view
  const configStandarView = async () => {
    try {
      const preferencesStandardView = store.get("settings.isStandardView") as boolean;
      // console.log("Preferences StandardView", preferencesStandardViewJSON);
      if (preferencesStandardView !== null) {
        state.isStandardView = preferencesStandardView;
        setState({ ...state });
      } else {
        state.isStandardView = true;
        setState({ ...state });
      }
    } catch (e) {
      console.log("error to set isStandardView");
    }
  };

  const deleteSuperkey = () => {
    const { superkeys, selectedSuper } = state;
    if (superkeys.length > 0) {
      let aux = JSON.parse(JSON.stringify(superkeys));
      const selected = selectedSuper;
      aux.splice(selected, 1);
      aux = aux.map((item: SuperkeysType, index: number) => {
        const newItem = item;
        newItem.id = index;
        return newItem;
      });
      if (selected >= superkeys.length - 1) {
        checkKBSuperkeys(aux, aux.length - 1, aux.length + 53980);
      } else {
        checkKBSuperkeys(aux, selected, selected + 53980);
      }
    }
  };

  const duplicateSuperkey = () => {
    const { superkeys, selectedSuper } = state;
    const aux = { ...superkeys[selectedSuper] };
    aux.id = superkeys.length;
    aux.name = `Copy of ${aux.name}`;
    aux.actions = [...aux.actions];
    superkeys.push(aux);
    updateSuper(superkeys, -1);
    changeSelected(aux.id);
  };

  const closeStandardViewModal = (code: number) => {
    onKeyChange(code);
    state.showStandardView = false;
    state.selectedAction = -1;
    setState({ ...state });
  };

  const addSuperkey = (SKname: string) => {
    const { superkeys, maxSuperKeys } = state;
    // console.log("TEST", superkeys.length, maxSuperKeys);
    if (superkeys.length < maxSuperKeys) {
      const aux: SuperkeysType[] = JSON.parse(JSON.stringify(superkeys));
      const newID = aux.length;
      aux.push({
        actions: [0, 0, 0, 0, 0],
        name: SKname,
        id: newID,
        superkey: "",
      });
      updateSuper(aux, newID);
    }
  };

  useEffect(() => {
    const getInitialData = async () => {
      const { setLoading } = props;
      console.log("initial load of superkeys", setLoading);
      await loadSuperkeys();
      await configStandarView();
      setState({ ...state, loading: false });
      setLoading(false);
    };
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const destroyThisContext = async () => {
    const { setLoading } = props;
    setState({ ...state, loading: true });
    await loadSuperkeys();
    await configStandarView();
    setState({ ...state, loading: false });
    setLoading(false);
  };

  const {
    currentLanguageLayout,
    kbtype,
    selectedSuper,
    superkeys,
    macros,
    selectedAction,
    isStandardView: isStandardViewSuperkeys,
    listToDelete,
    modified,
    showStandardView,
    showDeleteModal,
    loading,
  } = state;

  const tempkey = keymapDB.parse(superkeys[selectedSuper] !== undefined ? superkeys[selectedSuper].actions[selectedAction] : 0);
  const code = keymapDB.keySegmentator(tempkey.keyCode);
  // console.log(selectedSuper, JSON.stringify(code), JSON.stringify(superkeys));
  const actions = superkeys.length > 0 && superkeys.length > selectedSuper ? superkeys[selectedSuper].actions : [];
  const superName = superkeys.length > 0 && superkeys.length > selectedSuper ? superkeys[selectedSuper].name : "";

  const listOfSKK = listToDelete.map(({ layer, pos, superIdx }) => (
    <Row key={`${layer}-${pos}-${superIdx}`}>
      <Col xs={12} className="px-0 text-center gridded">
        <p className="titles alignvert">{`Key in layer ${layer + 1} and pos ${pos}`}</p>
      </Col>
    </Row>
  ));
  if (loading || !Array.isArray(superkeys)) return <LogoLoaderCentered />;
  return (
    <Styles className="superkeys">
      <Container fluid className={`${isStandardViewSuperkeys ? "standarViewMode" : "singleViewMode"}`}>
        <PageHeader
          text={i18n.app.menu.superkeys}
          showSaving
          contentSelector={
            <SuperkeysSelector
              itemList={superkeys}
              selectedItem={selectedSuper}
              subtitle="Superkeys"
              onSelect={changeSelected}
              addItem={addSuperkey}
              deleteItem={deleteSuperkey}
              updateItem={saveName}
              cloneItem={duplicateSuperkey}
            />
          }
          saveContext={writeSuper}
          destroyContext={destroyThisContext}
          inContext={modified}
          isSaving={isSaving}
        />

        <Callout
          content={i18n.editor.superkeys.callout}
          className="mt-md"
          size="sm"
          hasVideo
          media="6Az05_Yl6AU"
          videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
          videoDuration="5:34"
        />

        <SuperkeyActions
          isStandardViewSuperkeys={isStandardViewSuperkeys}
          superkeys={superkeys}
          selected={selectedSuper}
          selectedAction={selectedAction}
          macros={macros}
          changeSelected={changeSelected}
          updateSuper={updateSuper}
          updateAction={updateAction}
          changeAction={changeAction}
          keymapDB={keymapDB}
        />

        {isStandardViewSuperkeys && <SuperKeysFeatures />}
      </Container>
      {!isStandardViewSuperkeys ? (
        <Container fluid className="keyboardcontainer" hidden={selectedAction < 0}>
          <KeyPickerKeyboard
            key={JSON.stringify(superkeys) + selectedAction}
            onKeySelect={onKeyChange}
            code={code}
            macros={macros}
            superkeys={superkeys}
            actions={actions}
            action={selectedAction}
            actTab="super"
            superName={superName}
            selectedlanguage={currentLanguageLayout}
            kbtype={kbtype}
          />
        </Container>
      ) : (
        ""
      )}
      <LayoutViewSelector
        onToggle={onToggle}
        isStandardView={isStandardViewSuperkeys}
        tooltip={i18n.editor.superkeys.tooltip}
        layoutSelectorPosition={{
          x: 0,
          y: 0,
        }}
      />
      {isStandardViewSuperkeys ? (
        <StandardView
          showStandardView={showStandardView}
          closeStandardView={closeStandardViewModal}
          handleSave={handleSaveStandardView}
          onKeySelect={onKeyChange}
          macros={macros}
          superkeys={superkeys}
          actions={selectedAction > -1 ? superkeys[selectedSuper].actions : []}
          keyIndex={selectedAction}
          code={code}
          layerData={selectedAction > -1 ? superkeys[selectedSuper].actions : []}
          actTab="super"
          selectedlanguage={currentLanguageLayout}
          kbtype={kbtype}
          isStandardView={isStandardViewSuperkeys}
          isWireless={deviceState?.currentDevice?.device?.info?.keyboardType === "wireless"}
        />
      ) : (
        ""
      )}

      <Modal show={showDeleteModal} onHide={toggleDeleteModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.superkeys.deleteModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{i18n.editor.superkeys.deleteModal.body}</p>
          {listOfSKK}
        </Modal.Body>
        <Modal.Footer>
          <RegularButton
            buttonText={i18n.editor.superkeys.deleteModal.cancelButton}
            styles="outline transp-bg"
            size="sm"
            onClick={toggleDeleteModal}
          />
          <RegularButton
            buttonText={i18n.editor.superkeys.deleteModal.applyButton}
            styles="outline gradient"
            size="sm"
            onClick={RemoveDeletedSK}
          />
        </Modal.Footer>
      </Modal>
    </Styles>
  );
}

export default SuperkeysEditor;

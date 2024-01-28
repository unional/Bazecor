import type { PortInfo } from "@serialport/bindings-cpp";
import { Focus } from "./Focus";

export class LoggingFocusSpy extends Focus {
  public logs: Array<[method: LogMethod, ...args: unknown[]]> = [];
  constructor() {
    super();
    this.logger = mockLogger(this.logs);
  }
  public debugLog(...args: unknown[]): void {
    super.debugLog(...args);
  }
}

export class FocusStub extends LoggingFocusSpy {
  private portStubs: PortInfo[];
  constructor({ ports }: { ports: Partial<PortInfo>[] }) {
    super();
    this.portStubs = ports.map(stubPortInfo);
  }
  protected async listSerialPorts(): Promise<PortInfo[]> {
    return this.portStubs;
  }
}

function stubPortInfo(port: Partial<PortInfo>): PortInfo {
  return {
    locationId: "",
    manufacturer: "",
    path: "",
    pnpId: "",
    productId: "",
    serialNumber: "",
    vendorId: "",
    ...port,
  };
}

export type LogMethod = keyof Console;

export function mockLogger(records: Array<[method: LogMethod, ...args: unknown[]]>) {
  const methods = Object.keys(console) as LogMethod[];
  return methods.reduce((p: any, k) => {
    p[k] = (...args: unknown[]) => {
      records.push([k, ...args]);
    };
    return p;
  }, {} as Console);
}

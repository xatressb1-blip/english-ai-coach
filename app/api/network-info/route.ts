import { NextResponse } from "next/server";
import os from "node:os";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LanAddress {
  interfaceName: string;
  address: string;
}

function isPrivateIpv4(address: string) {
  if (/^10\./.test(address)) return true;
  if (/^192\.168\./.test(address)) return true;
  const match = address.match(/^172\.(\d{1,2})\./);
  if (!match) return false;
  const secondOctet = Number(match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

function scoreAddress(item: LanAddress) {
  const name = item.interfaceName.toLowerCase();
  let score = 0;
  if (/192\.168\.137\./.test(item.address)) score += 100; // Common Windows Mobile Hotspot subnet.
  if (/wi-?fi|wireless|wlan/.test(name)) score += 40;
  if (/ethernet|lan/.test(name)) score += 30;
  if (/192\.168\./.test(item.address)) score += 20;
  if (/10\./.test(item.address)) score += 10;
  if (/virtual|vmware|vbox|hyper-v|wsl|docker|vpn|tailscale/.test(name)) score -= 60;
  return score;
}

export async function GET() {
  const addresses: LanAddress[] = [];
  const interfaces = os.networkInterfaces();

  Object.entries(interfaces).forEach(([interfaceName, entries]) => {
    entries?.forEach((entry) => {
      if (entry.family !== "IPv4" || entry.internal || !isPrivateIpv4(entry.address)) return;
      addresses.push({ interfaceName, address: entry.address });
    });
  });

  addresses.sort((left, right) => scoreAddress(right) - scoreAddress(left));
  return NextResponse.json({
    addresses,
    preferred: addresses[0] ?? null,
  });
}

const os = require('os');

function getLanIPv4() {
  const candidates = [];
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs || []) {
      const isV4 = addr.family === 'IPv4' || addr.family === 4;
      if (isV4 && !addr.internal) candidates.push(addr.address);
    }
  }
  return (
    candidates.find((ip) => ip.startsWith('192.168.')) ||
    candidates.find((ip) => ip.startsWith('10.')) ||
    candidates.find((ip) => /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) ||
    candidates[0] ||
    null
  );
}

module.exports = { getLanIPv4 };

import * as R from 'ramda';
// 去除无效字符
function cleanJSONData(text: string) {
    const cleanedText = text.replace(/[^\x20-\x7E]/g, ''); // 只保留可打印字符
    return cleanedText;
};
function extractJSONFast(text: string) {
    const results = [];
    let start = -1;
    let depth = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            if (depth === 0) start = i; // 记录 JSON 开始位置
            depth++;
        } else if (text[i] === '}') {
            depth--;
            if (depth === 0 && start !== -1) {
                const jsonStr = text.slice(start, i + 1); // 截取 JSON 字符串
                try {
                    results.push(JSON.parse(jsonStr)); // 尝试解析
                } catch (error) {
                    console.error('JSON 解析失败:', jsonStr, error);
                }
                start = -1;
            };
        };
    };
    return results;
};
function encodePacket(op: number, body: object): ArrayBuffer {
    // 替代 Buffer.from()
    const bodyBuffer = new TextEncoder().encode(JSON.stringify(body));
    // 头部 (16 字节) + 正文
    const packetLen = 16 + bodyBuffer.length;
    const headerLen = 16;
    const version = 1;
    const sequence = 1;
    // 分配缓冲区
    const buffer = new Uint8Array(packetLen); 
    const view = new DataView(buffer.buffer);
    // 封包总大小
    view.setUint32(0, packetLen, false);
    // 头部大小
    view.setUint16(4, headerLen, false);
    // 协议版本
    view.setUint16(6, version, false);
    // 操作码
    view.setUint32(8, op, false); 
    // sequence
    view.setUint32(12, sequence, false);
    // 复制正文数据
    buffer.set(bodyBuffer, 16); 

    return buffer.buffer;
};
async function parsePacketHeader(blob: Blob) {
    // 获取前 16 字节
    const arrayBuffer = await blob.slice(0, 16).arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    // 封包总大小 (4 字节)
    const totalSize = dataView.getUint32(0, false);
    // 头部大小 (2 字节)
    const headerSize = dataView.getUint16(4, false);
    // 协议版本 (2 字节) 
    const protocolVersion = dataView.getUint16(6, false);
    // 操作码 (4 字节)
    const operationCode = dataView.getUint32(8, false); 
    // sequence (4 字节)
    const sequence = dataView.getUint32(12, false); 
    const bodyBlob = blob.slice(headerSize);
    if(protocolVersion === 3) {
        return bodyBlob;
    }
    else {
        return null
    };
};

async function parseCompressedBody(blob: Blob | null) {
    try {
        if(blob === null) {
            return [];
        };
        // 1. 动态导入 brotli-wasm
        const brotli: any = await import('https://unpkg.com/brotli-wasm@3.0.0/index.web.js?module')
        .then(m => m.default);

        // 2. 读取 Blob 并转换为 ArrayBuffer
        const compressedArrayBuffer = await blob.arrayBuffer();
        const compressedData = new Uint8Array(compressedArrayBuffer);
        // 3. 解压缩数据
        const decompressedData = brotli.decompress(compressedData);

        // 4. 转换为字符串
        const textDecoder = new TextDecoder('utf-8');
        const decompressedString = textDecoder.decode(decompressedData);
        const cleanJSONArrString = extractJSONFast(cleanJSONData(decompressedString));
        return cleanJSONArrString;
    } catch (error) {
        console.log('解压缩数据错误:', error);
        return [];
    };
};

function processDanmakuData(dataArr: any[]) {
    R.map((data: any) => {
        if(data.cmd === 'DANMU_MSG') {
            const info = JSON.parse(data.info[0][15].extra);
            console.log(info);
        };
    })(dataArr);
};

export default R.pipeWith(Promise.resolve, [ parsePacketHeader, parseCompressedBody, processDanmakuData ]);
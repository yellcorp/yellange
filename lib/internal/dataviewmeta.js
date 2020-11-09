/**
 * @file lib/internal/dataviewmeta
 *
 * A repository of information about getter and setter methods of
 * `DataView.prototype`.
 */
const DataViewProto = DataView.prototype;

// prettier-ignore
export function getPrototypeMethodInfo() {
  return [
    { suffix: "Int8",    getter: DataViewProto.getInt8,    setter: DataViewProto.setInt8,    size: 1 },
    { suffix: "Uint8",   getter: DataViewProto.getUint8,   setter: DataViewProto.setUint8,   size: 1 },
    { suffix: "Int16",   getter: DataViewProto.getInt16,   setter: DataViewProto.setInt16,   size: 2 },
    { suffix: "Uint16",  getter: DataViewProto.getUint16,  setter: DataViewProto.setUint16,  size: 2 },
    { suffix: "Int32",   getter: DataViewProto.getInt32,   setter: DataViewProto.setInt32,   size: 4 },
    { suffix: "Uint32",  getter: DataViewProto.getUint32,  setter: DataViewProto.setUint32,  size: 4 },
    { suffix: "Float32", getter: DataViewProto.getFloat32, setter: DataViewProto.setFloat32, size: 4 },
    { suffix: "Float64", getter: DataViewProto.getFloat64, setter: DataViewProto.setFloat64, size: 8 },
  ];
}

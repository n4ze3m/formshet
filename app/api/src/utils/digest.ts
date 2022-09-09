export const convertToArrayOfObject = (columns: any[][], rows: any[][]) => {
    const result: any = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const obj: any = {};
        obj["_id"] = i + 1;
        for (let j = 0; j < row.length; j++) {
            for (let k = 0; k < columns.length; k++) {
                let key = columns[k][j] || `column${j}`;
                obj[key] = row[j];
            }
        }
        result.push(obj);
    }
    return result;
}
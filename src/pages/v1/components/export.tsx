import _ from 'lodash';
import * as ExcelJS from 'exceljs'
import * as FileSaver from 'file-saver'

interface ExportDataComponent {
    tableName: string,
    tableIndex: string,
    cell: ExportCellComponent | ExportCellComponent[]
}

interface ExportCellComponent {
    header: string,
    dataIndex: string,
    width: number,
}

const data: any = {
    "analisa": [
        {
            "nis": "3354",
            "name": "Wahyudi Putro Adi Nugroho",
            "nilaiRaport": "Cukup",
            "c1": "50",
            "penghasilanOrangTua": "2.000.000 s/d 3.000.000",
            "c2": "75",
            "pekerjaanOrangTua": "Petani",
            "c3": "75",
            "jumlahTanggungan": "<= 4",
            "c4": "5",
            "pendidikanOrangTua": "SD / Tidak Tamat SD",
            "c5": "100",
            "jumlahSaudaraKandung": "1",
            "c6": "5"
        },
        {
            "nis": "3368",
            "name": "Novita Arum Sari",
            "penghasilanOrangTua": "3.000.000 s/d 5.000.000",
            "c2": "50",
            "jumlahSaudaraKandung": "3",
            "c6": "50",
            "jumlahTanggungan": "<= 8",
            "c4": "50",
            "pendidikanOrangTua": "Diploma",
            "c5": "25",
            "pekerjaanOrangTua": "Wiraswasta",
            "c3": "25",
            "nilaiRaport": "Baik",
            "c1": "75"
        },
        {
            "nis": "3399",
            "name": "Rahmat Hidayat",
            "penghasilanOrangTua": "2.000.000 s/d 3.000.000",
            "c2": "75",
            "jumlahSaudaraKandung": "2",
            "c6": "25",
            "jumlahTanggungan": "<= 6",
            "c4": "25",
            "pendidikanOrangTua": "SMP Sederajat",
            "c5": "75",
            "pekerjaanOrangTua": "Petani",
            "c3": "75",
            "nilaiRaport": "Sangat Baik",
            "c1": "100"
        },
        {
            "nis": "3509",
            "name": "Septiana Amanda Melati Sukma",
            "penghasilanOrangTua": "2.000.000 s/d 3.000.000",
            "c2": "75",
            "jumlahSaudaraKandung": "2",
            "c6": "25",
            "jumlahTanggungan": "<= 4",
            "c4": "5",
            "pendidikanOrangTua": "SMA Sederajat",
            "c5": "50",
            "pekerjaanOrangTua": "Petani",
            "c3": "75",
            "nilaiRaport": "Cukup",
            "c1": "50"
        }
    ],
    "normalisasi": [
        {
            "nis": "3354",
            "c1": "0.3482",
            "c2": "0.5388",
            "c3": "0.5669",
            "c4": "0.0887",
            "c5": "0.7303",
            "c6": "0.0814"
        },
        {
            "nis": "3368",
            "c1": "0.5222",
            "c2": "0.3592",
            "c3": "0.1890",
            "c4": "0.8874",
            "c5": "0.1826",
            "c6": "0.8138"
        },
        {
            "nis": "3399",
            "c1": "0.6963",
            "c2": "0.5388",
            "c3": "0.5669",
            "c4": "0.4437",
            "c5": "0.5477",
            "c6": "0.4069"
        },
        {
            "nis": "3509",
            "c1": "0.3482",
            "c2": "0.5388",
            "c3": "0.5669",
            "c4": "0.0887",
            "c5": "0.3651",
            "c6": "0.4069"
        }
    ],
    "normalTerbobot": [
        {
            "name": "Wahyudi Putro Adi Nugroho",
            "nis": "3354",
            "c1": "8.7050",
            "c2": "10.7760",
            "c3": "8.5035",
            "c4": "1.3305",
            "c5": "7.3030",
            "c6": "1.2210"
        },
        {
            "name": "Novita Arum Sari",
            "nis": "3368",
            "c1": "13.0550",
            "c2": "7.1840",
            "c3": "2.8350",
            "c4": "13.3110",
            "c5": "1.8260",
            "c6": "12.2070"
        },
        {
            "name": "Rahmat Hidayat",
            "nis": "3399",
            "c1": "17.4075",
            "c2": "10.7760",
            "c3": "8.5035",
            "c4": "6.6555",
            "c5": "5.4770",
            "c6": "6.1035"
        },
        {
            "name": "Septiana Amanda Melati Sukma",
            "nis": "3509",
            "c1": "8.7050",
            "c2": "10.7760",
            "c3": "8.5035",
            "c4": "1.3305",
            "c5": "3.6510",
            "c6": "6.1035"
        }
    ],
    "solusiIdeal": [
        {
            "solusi": "Positif",
            "c1": "17.4075",
            "c2": "10.7760",
            "c3": "8.5035",
            "c4": "13.3110",
            "c5": "7.3030",
            "c6": "12.2070"
        },
        {
            "solusi": "Negatif",
            "c1": "8.7050",
            "c2": "7.1840",
            "c3": "2.8350",
            "c4": "1.3305",
            "c5": "1.8260",
            "c6": "1.2210"
        }
    ],
    "jarakSolusiPreferensi": [
        {
            "nis": "3354",
            "name": "Wahyudi Putro Adi Nugroho",
            "distanceToPositive": "18.4380",
            "distanceToNegative": "8.6621",
            "preferenceScore": "0.6804"
        },
        {
            "nis": "3368",
            "name": "Novita Arum Sari",
            "distanceToPositive": "9.6941",
            "distanceToNegative": "16.8270",
            "preferenceScore": "0.3655"
        },
        {
            "nis": "3399",
            "name": "Rahmat Hidayat",
            "distanceToPositive": "9.2132",
            "distanceToNegative": "13.6489",
            "preferenceScore": "0.4030"
        },
        {
            "nis": "3509",
            "name": "Septiana Amanda Melati Sukma",
            "distanceToPositive": "16.4273",
            "distanceToNegative": "8.4973",
            "preferenceScore": "0.6591"
        }
    ]
}

const exportToExcel = async (props: ExportDataComponent[]) => {
    let workbook = new ExcelJS.Workbook()
    let worksheet = workbook.addWorksheet('Hasil Perhitungan')

    let combinedData: Array<Array<string>> = [];
    let tableNameIndexes: Array<number> = [];
    let headerIndexes: Array<number> = [];

    props.map((table: any, idx: number) => {
        if (table.tableName !== '') {
            worksheet.addRow([_.startCase(table.tableName)])
            worksheet.getRow(worksheet.lastRow!.number).font = { name: 'Calibri', size: 16, bold: true }
            worksheet.getRow(worksheet.lastRow!.number).alignment = { vertical: 'middle', horizontal: 'center' }
            worksheet.mergeCells(worksheet.lastRow!.number, 1, worksheet.lastRow!.number, table.cell.length)
            // combinedData.push([_.startCase(table.tableName)]);
            // tableNameIndexes.push(combinedData.length - 1);
            worksheet.addRow([]);
        }

        const header = table.cell.map((cell: any) => cell.header);
        worksheet.addRow(header).font = { name: 'Calibri', size: 12 };
        worksheet.getRow(worksheet.lastRow!.number).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };

        table.cell.forEach((column: any, index: number) => {
            if (typeof column.width === 'number' && column.width > 0) {
                const col: ExcelJS.Column = worksheet.getColumn(index + 1);
                col.width = column.width;
            }
        });

        data[table.tableIndex].forEach((row: any) => {
            // Mengumpulkan data untuk satu baris
            const rowData = table.cell.map((cell: any) => row[cell.dataIndex]);
        
            // Menambahkan baris ke worksheet
            worksheet.addRow(rowData);
        
            // Mengatur lebar kolom untuk baris ini, berdasarkan cell.width
            // table.cell.forEach((cell: any, index: number) => {
            //     // Mengatur lebar kolom hanya sekali, bukan di setiap baris
            //     worksheet.getColumn(index + 1).width = Math.max(cell.width, worksheet.getColumn(index + 1).width || 0);
            // });
        });

        // if (table.tableName !== '') {
        //     headerIndexes.push(header.length - 1);
        // }

        // combinedData.push(header);

        // const rows = data[table.tableIndex].map((row: any) => {
        //     return table.cell.map((cell: any) => row[cell.dataIndex]);
        // });

        // rows.forEach((row: any) => {
        //     combinedData.push(row);
        // });

        // const isLastTable = idx === props.length - 1;
        // const isLastWithSameTableIndex = !isLastTable && table.tableIndex !== props[idx + 1]?.tableIndex;

        // if (isLastWithSameTableIndex) {
        //     combinedData.push(['']);
        //     combinedData.push(['']);
        // }
    });

    // worksheet.addRows(combinedData)

    // tableNameIndexes.map((table: number, index: number) => {
    //     const colLetter = String.fromCharCode(65 + headerIndexes[index]);
    //     worksheet.mergeCells(`A${table + 1}:${colLetter}${table + 1}`)
    //     let cellTable: ExcelJS.Cell = worksheet.getCell(`A${table + 1}:${colLetter}${table + 1}`);
    //     cellTable.font = { name: 'Calibri', size: 16, bold: true }
    //     cellTable.alignment = { vertical: 'middle', horizontal: 'center' }
    // });

    let buffer = await workbook.xlsx.writeBuffer();
    let uint8Array = new Uint8Array(buffer);

    let blob = new Blob([uint8Array], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    FileSaver.saveAs(blob, 'Hasil Perhitungan.xlsx')
};

export default function ExcelExportButton() {

    const exports = () => {
        const data: ExportDataComponent[] = [
            {
                tableName: 'Hasil Analisa',
                tableIndex: 'analisa',
                cell: [
                    { header: 'Nama Siswa', dataIndex: 'name', width: 10 },
                    { header: 'Nilai Raport', dataIndex: 'nilaiRaport', width: 20 },
                    { header: 'Penghasilan Orang Tua', dataIndex: 'penghasilanOrangTua', width: 40 },
                    { header: 'Pekerjaan Orang Tua', dataIndex: 'pekerjaanOrangTua', width: 20 },
                    { header: 'Jumlah Tanggungan', dataIndex: 'jumlahTanggungan', width: 20 },
                    { header: 'Pendidikan Orang Tua', dataIndex: 'pendidikanOrangTua', width: 20 },
                    { header: 'Jumlah Saudara Kandung', dataIndex: 'jumlahSaudaraKandung', width: 20 },
                ]
            },
            {
                tableName: '',
                tableIndex: 'analisa',
                cell: [
                    { header: 'NIS', dataIndex: 'nis', width: 20 },
                    { header: 'C1', dataIndex: 'c1', width: 20 },
                    { header: 'C2', dataIndex: 'c2', width: 20 },
                    { header: 'C3', dataIndex: 'c3', width: 20 },
                    { header: 'C4', dataIndex: 'c4', width: 20 },
                    { header: 'C5', dataIndex: 'c5', width: 20 },
                    { header: 'C6', dataIndex: 'c6', width: 20 },
                ]
            },
            {
                tableName: 'Normalisasi',
                tableIndex: 'normalisasi',
                cell: [
                    { header: 'NIS', dataIndex: 'nis', width: 20 },
                    { header: 'C1', dataIndex: 'c1', width: 20 },
                    { header: 'C2', dataIndex: 'c2', width: 20 },
                    { header: 'C3', dataIndex: 'c3', width: 20 },
                    { header: 'C4', dataIndex: 'c4', width: 20 },
                    { header: 'C5', dataIndex: 'c5', width: 20 },
                    { header: 'C6', dataIndex: 'c6', width: 20 },
                ]
            },
            {
                tableName: 'Normal Terbobot',
                tableIndex: 'normalTerbobot',
                cell: [
                    { header: 'Nama Siswa', dataIndex: 'name', width: 20 },
                    { header: 'C1', dataIndex: 'c1', width: 20 },
                    { header: 'C2', dataIndex: 'c2', width: 20 },
                    { header: 'C3', dataIndex: 'c3', width: 20 },
                    { header: 'C4', dataIndex: 'c4', width: 20 },
                    { header: 'C5', dataIndex: 'c5', width: 20 },
                    { header: 'C6', dataIndex: 'c6', width: 20 },
                ]
            },
        ]
        exportToExcel(data)
    }

    return (
        <button onClick={exports}>Export Excel</button>
    );
}
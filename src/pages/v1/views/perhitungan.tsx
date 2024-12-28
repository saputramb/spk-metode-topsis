import { Alert, Box, Button, Snackbar, SnackbarCloseReason, Typography } from "@mui/material"
import PageContainer from "../components/container/PageContainer"
import DashboardCard from "../components/card/DashboardCard"
import { IconTableExport } from "@tabler/icons-react"
import CustomizedTables, { Column } from "../components/table/CustomizedTable"
import { useEffect, useState } from "react"
import client from "../services"
import BlankCard from "../components/card/BlankCard"
import ExcelExportButton from "../components/export"

interface SnackBar {
    status: 'error' | 'success' | 'info' | 'warning' | undefined,
    message: string,
    isOpen: boolean
}

const Perhitungan = () => {
    const [dataAnalisa, setDataAnalisa] = useState<any[]>([])
    const [dataNormalisasi, setDataNormalisasi] = useState<any[]>([])
    const [dataNormalTerbobot, setDataNormalTerbobot] = useState<any[]>([])
    const [dataSolusiIdeal, setDataSolusiIdeal] = useState<any[]>([])
    const [dataJarakSolusiPreferensi, setDataJarakSolusiPreferensi] = useState<any[]>([])
    const [dataRank, setDataRank] = useState<any[]>([])

    const [snackBar, setSnackBar] = useState<SnackBar>({ status: undefined, message: '', isOpen: false });

    const openSnackBar = ({ status, message }: SnackBar) => {
        setSnackBar({ status: status, message: message, isOpen: true });
    };

    const closeSnackBar = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBar({ status: undefined, message: '', isOpen: false });
    };

    const columnsAnalisa1: Column[] = [
        {
            dataIndex: 'name',
            label: 'Nama Siswa',
            sorter: true,
        },
        {
            dataIndex: 'nilaiRaport',
            label: 'Nilai Raport',
            sorter: true,
        },
        {
            dataIndex: 'penghasilanOrangTua',
            label: 'Penghasilan Orang Tua',
            sorter: true,
        },
        {
            dataIndex: 'pekerjaanOrangTua',
            label: 'Pekerjaan Orang Tua',
            sorter: true,
        },
        {
            dataIndex: 'jumlahTanggungan',
            label: 'Jumlah Tanggungan',
            sorter: true,
        },
        {
            dataIndex: 'pendidikanOrangTua',
            label: 'Pendidikan Orang Tua',
            sorter: true,
        },
        {
            dataIndex: 'jumlahSaudaraKandung',
            label: 'Jumlah Saudara Kandung',
            minWidth: 125,
            sorter: true,
        },
    ]

    const columnsAnalisa2: Column[] = [
        {
            dataIndex: 'nis',
            label: 'NIS',
            sorter: true,
        },
        {
            dataIndex: 'c1',
            label: 'C1',
            sorter: true,
        },
        {
            dataIndex: 'c2',
            label: 'C2',
            sorter: true,
        },
        {
            dataIndex: 'c3',
            label: 'C3',
            sorter: true,
        },
        {
            dataIndex: 'c4',
            label: 'C4',
            sorter: true,
        },
        {
            dataIndex: 'c5',
            label: 'C5',
            sorter: true,
        },
        {
            dataIndex: 'c6',
            label: 'C6',
            sorter: true,
        },
    ]

    const columnsNormalTerbobot: Column[] = [
        {
            dataIndex: 'name',
            label: 'Nama Siswa',
            sorter: true,
        },
        {
            dataIndex: 'c1',
            label: 'C1',
            sorter: true,
        },
        {
            dataIndex: 'c2',
            label: 'C2',
            sorter: true,
        },
        {
            dataIndex: 'c3',
            label: 'C3',
            sorter: true,
        },
        {
            dataIndex: 'c4',
            label: 'C4',
            sorter: true,
        },
        {
            dataIndex: 'c5',
            label: 'C5',
            sorter: true,
        },
        {
            dataIndex: 'c6',
            label: 'C6',
            sorter: true,
        },
    ]

    const columnsSolusiIdeal: Column[] = [
        {
            dataIndex: 'solusi',
            label: '',
            sorter: true,
        },
        {
            dataIndex: 'c1',
            label: 'C1',
            sorter: true,
        },
        {
            dataIndex: 'c2',
            label: 'C2',
            sorter: true,
        },
        {
            dataIndex: 'c3',
            label: 'C3',
            sorter: true,
        },
        {
            dataIndex: 'c4',
            label: 'C4',
            sorter: true,
        },
        {
            dataIndex: 'c5',
            label: 'C5',
            sorter: true,
        },
        {
            dataIndex: 'c6',
            label: 'C6',
            sorter: true,
        },
    ]

    const columnsJarakSolusiPreferensi: Column[] = [
        {
            dataIndex: 'nis',
            label: 'NIS',
            sorter: true,
        },
        {
            dataIndex: 'distanceToPositive',
            label: 'Positif',
            sorter: true,
        },
        {
            dataIndex: 'distanceToNegative',
            label: 'Negatif',
            sorter: true,
        },
        {
            dataIndex: 'preferenceScore',
            label: 'Preferensi',
            sorter: true,
        },
    ]

    const columnsRank: Column[] = [
        {
            dataIndex: 'nis',
            label: 'NIS',
            sorter: true,
        },
        {
            dataIndex: 'name',
            label: 'Nama Siswa',
            sorter: true,
        },
        {
            dataIndex: 'preferenceScore',
            label: 'Total',
            sorter: true,
        },
        {
            dataIndex: 'rank',
            label: 'Rank',
            sorter: true,
        },
    ]

    const perhitungan = async () => {
        try {
            const result = await client.get('/api/services/perhitungan')
            setDataAnalisa(result.data.analisa)
            setDataNormalisasi(result.data.normalisasi)
            setDataNormalTerbobot(result.data.normalTerbobot)
            setDataSolusiIdeal(result.data.solusiIdeal)
            setDataJarakSolusiPreferensi(result.data.jarakSolusiPreferensi)

            const sortedResults = result.data.jarakSolusiPreferensi.sort((a: any, b: any) => {
                return parseFloat(b.preferenceScore) - parseFloat(a.preferenceScore);
            });

            const rankedResults = sortedResults.map((item: any, index: any) => {
                return {
                    ...item,
                    rank: index + 1
                };
            });

            setDataRank(rankedResults)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    useEffect(() => {
        perhitungan()
    }, [])

    return (
        <>
            <PageContainer title="Hasil Perhitungan">
                <Box sx={{ width: { xs: '85vw', md: '92vw', sm: '90vw', xl: '100%', lg: '72vw' } }}>
                    <BlankCard>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} px={2}>
                            <Typography variant="h5">Hasil Perhitungan</Typography>
                            <Button
                                sx={{ height: '40px' }}
                                disableElevation
                                variant="contained"
                                aria-label="create-kriteria"
                            >
                                <IconTableExport style={{ marginRight: 5 }} /> Export
                            </Button>
                            <ExcelExportButton />
                        </Box>
                    </BlankCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Hasil Analisa"
                    >
                        <Box>
                            <CustomizedTables data={[dataAnalisa, setDataAnalisa]} columns={columnsAnalisa1} />
                            <Box my={5} />
                            <CustomizedTables data={[dataAnalisa, setDataAnalisa]} columns={columnsAnalisa2} />
                        </Box>
                    </DashboardCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Normalisasi"
                    >
                        <CustomizedTables data={[dataNormalisasi, setDataNormalisasi]} columns={columnsAnalisa2} />
                    </DashboardCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Normal Terbobot"
                    >
                        <CustomizedTables data={[dataNormalTerbobot, setDataNormalTerbobot]} columns={columnsNormalTerbobot} />
                    </DashboardCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Matriks Solusi Ideal"
                    >
                        <CustomizedTables data={[dataSolusiIdeal, setDataSolusiIdeal]} columns={columnsSolusiIdeal} />
                    </DashboardCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Jarak Solusi & Nilai Preferensi"
                    >
                        <CustomizedTables data={[dataJarakSolusiPreferensi, setDataJarakSolusiPreferensi]} columns={columnsJarakSolusiPreferensi} />
                    </DashboardCard>
                    <Box my={2} />
                    <DashboardCard
                        title="Perangkingan"
                    >
                        <CustomizedTables data={[dataRank, setDataRank]} columns={columnsRank} />
                    </DashboardCard>
                </Box>
            </PageContainer>
            {snackBar.isOpen && <Snackbar open={snackBar.isOpen} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={closeSnackBar} >
                <Alert
                    onClose={closeSnackBar}
                    severity={snackBar.status}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '20px' }}
                >
                    {snackBar.message}
                </Alert>
            </Snackbar>}
        </>
    )
}

export default Perhitungan
import { Box, Button, SnackbarCloseReason, styled, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material"
import DashboardCard from "../components/card/DashboardCard"
import CustomizedTables, { Column } from "../components/table/CustomizedTable"
import PageContainer from "../components/container/PageContainer"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { DeleteOutline, ManageAccountsOutlined } from "@mui/icons-material"
import _ from "lodash"
import client from "../services"
import CustomizedSelect from "../components/CustomizedSelect"

interface InputComponent {
    id: string
    label: string
    type: 'email' | 'number' | 'password' | 'text' | 'select'
    select?: any[]
}

interface SnackBar {
    status: 'error' | 'success' | 'info' | 'warning' | undefined,
    message: string,
    isOpen: boolean
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Bobot = () => {
    const [data, setData] = useState<any[]>([])
    const [dataSiswa, setDataSiswa] = useState<string[]>([])
    const [modal, setModal] = useState<boolean>(false)
    const [modalUpdate, setModalUpdate] = useState<boolean>(false)
    const [formData, setFormData] = useState<any | {
        siswa: string,
        nilaiRaport: string,
        penghasilanOrangTua: string,
        pekerjaanOrangTua: string,
        jumlahTanggungan: string,
        pendidikanOrangTua: string,
        jumlahSaudaraKandung: string,
    }>({
        siswa: '',
        nilaiRaport: '',
        penghasilanOrangTua: '',
        pekerjaanOrangTua: '',
        jumlahTanggungan: '',
        pendidikanOrangTua: '',
        jumlahSaudaraKandung: '',
    })
    const [snackBar, setSnackBar] = useState<SnackBar>({ status: undefined, message: '', isOpen: false });
    const [kategori, setKategori] = useState<any[]>([])

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

    const openModal = () => setModal(true)

    const closeModal = () => {
        setFormData({
            siswa: '',
            nilaiRaport: '',
            penghasilanOrangTua: '',
            pekerjaanOrangTua: '',
            jumlahTanggungan: '',
            pendidikanOrangTua: '',
            jumlahSaudaraKandung: '',
        })
        setModal(false)
    }

    const openModalUpdate = (row: any) => async (event: any) => {
        setFormData({
            siswa: `${row.nis} - ${row.name}`,
            nis: row.nis,
            name: row.name,
            nilaiRaport: row.nilaiRaport,
            penghasilanOrangTua: row.penghasilanOrangTua,
            pekerjaanOrangTua: row.pekerjaanOrangTua,
            jumlahTanggungan: row.jumlahTanggungan,
            pendidikanOrangTua: row.pendidikanOrangTua,
            jumlahSaudaraKandung: row.jumlahSaudaraKandung,
        })
        setModalUpdate(true)
    }

    const closeModalUpdate = () => {
        setFormData({
            siswa: '',
            nilaiRaport: '',
            penghasilanOrangTua: '',
            pekerjaanOrangTua: '',
            jumlahTanggungan: '',
            pendidikanOrangTua: '',
            jumlahSaudaraKandung: '',
        })
        setModalUpdate(false)
    }

    const columns: Column[] = [
        {
            dataIndex: 'nis',
            label: 'NIS',
            sorter: true,
        },
        {
            dataIndex: 'name',
            label: 'Nama',
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
        {
            dataIndex: 'action',
            label: 'Action',
            render: (row: any) => (
                <Box display={'flex'} flexDirection={'row'} gap={1}>
                    <Button key={'update-button'} variant="contained" color="primary" onClick={openModalUpdate(row)}>
                        <ManageAccountsOutlined />
                    </Button>
                    <Box flexGrow={0.1} />
                    <Button key={'delete-button'} variant="contained" onClick={deleteBobot({ nis: row.nis })}>
                        <DeleteOutline />
                    </Button>
                </Box>
            )
        },
    ]

    const formInput: InputComponent[] = [
        {
            id: 'siswa',
            label: 'Siswa',
            type: 'select',
            select: dataSiswa
        },
        {
            id: 'nilaiRaport',
            label: 'Nilai Raport',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Nilai Raport').map((item) => item.kategori)
        },
        {
            id: 'penghasilanOrangTua',
            label: 'Penghasilan Orang Tua',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Penghasilan Orang Tua').map((item) => item.kategori)
        },
        {
            id: 'pekerjaanOrangTua',
            label: 'Pekerjaan Orang Tua',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Pekerjaan Orang Tua').map((item) => item.kategori)
        },
        {
            id: 'jumlahTanggungan',
            label: 'Jumlah Tanggungan',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Jumlah Tanggungan').map((item) => item.kategori)
        },
        {
            id: 'pendidikanOrangTua',
            label: 'Pendidikan Orang Tua',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Pendidikan Orang Tua').map((item) => item.kategori)
        },
        {
            id: 'jumlahSaudaraKandung',
            label: 'Jumlah Saudara Kandung',
            type: 'select',
            select: kategori.filter((fil: any) => fil.kriteria === 'Jumlah Saudara Kandung').map((item) => item.kategori)
        },
    ]

    const alternatif = async () => {
        try {
            const result = await client.get('/api/services/alternatif')
            setData(result.data)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const getKategori = async () => {
        try {
            const result = await client.get('/api/services/kategori')
            setKategori(result.data)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const getSiswa = async () => {
        try {
            const result = await client.get('/api/services/siswa')
            const data = result.data.map((item: any) => `${item.nis} - ${item.name}`)
            setDataSiswa(data)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    useEffect(() => {
        alternatif()
        getKategori()
        getSiswa()
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        if (target.name === 'siswa') {
            setFormData({ ...formData, [target.name]: target.value, nis: target.value.split(' - ')[0], name: target.value.split(' - ')[1] })
            return
        }
        setFormData({ ...formData, [target.name]: target.value })
        return
    };

    const addBobot = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post('/api/services/alternatif', formData)
            alternatif()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
            closeModal()
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const deleteBobot = ({ nis }: { nis: string }) => async (event: any) => {
        event.preventDefault();
        try {
            const result = await client.delete('/api/services/alternatif', { data: { nis } })
            alternatif()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const updateBobot = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const result = await client.patch('/api/services/alternatif', formData)
            alternatif()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
            closeModalUpdate()
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    return (
        <>
            <PageContainer title="Data Bobot">
                {/* ADD */}
                <BootstrapDialog
                    PaperProps={{ sx: { width: '30%', borderRadius: '20px' } }}
                    onClose={closeModal}
                    aria-labelledby="customized-dialog-title"
                    open={modal}
                >
                    <Box component={'form'} onSubmit={addBobot}>
                        <DialogTitle variant="h5" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Tambah Bobot
                        </DialogTitle>
                        <DialogContent>
                            {formInput.map((form) => (
                                <Box my={1.5} key={form.id}>
                                    <CustomizedSelect
                                        id={form.id}
                                        name={form.id}
                                        required
                                        onChange={handleChange}
                                        value={formData[form.id]}
                                        label={form.label}
                                        listItem={form.select!}
                                    />
                                </Box>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                        </DialogActions>
                    </Box>
                </BootstrapDialog>

                {/* UPDATE */}
                <BootstrapDialog
                    PaperProps={{ sx: { width: '30%', borderRadius: '20px' } }}
                    onClose={closeModalUpdate}
                    aria-labelledby="customized-dialog-title"
                    open={modalUpdate}
                >
                    <Box component={'form'} onSubmit={updateBobot}>
                        <DialogTitle variant="h5" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Ubah Bobot
                        </DialogTitle>
                        <DialogContent>
                            {formInput.map((form) => (
                                <Box my={1.5} key={form.id}>
                                    <CustomizedSelect
                                        id={form.id}
                                        name={form.id}
                                        required
                                        disable={form.id === 'siswa'}
                                        onChange={handleChange}
                                        value={formData[form.id]}
                                        label={form.label}
                                        listItem={form.select!}
                                    />
                                </Box>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={closeModalUpdate}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                Submit
                            </Button>
                        </DialogActions>
                    </Box>
                </BootstrapDialog>

                <Box sx={{ width: { xs: '85vw', md: '92vw', sm: '90vw', xl: '100%', lg: '72vw' } }}>
                    <DashboardCard
                        title="Data Bobot"
                        action={
                            <Button
                                disableElevation
                                variant="contained"
                                aria-label="create-kriteria"
                                onClick={openModal}
                            >
                                Tambah Bobot
                            </Button>
                        }
                    >
                        <CustomizedTables data={[data, setData]} columns={columns} />
                    </DashboardCard>
                </Box>
            </PageContainer >
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

export default Bobot
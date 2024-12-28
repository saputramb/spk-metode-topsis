import { Box, Button, SnackbarCloseReason, styled, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material"
import DashboardCard from "../components/card/DashboardCard"
import CustomizedTables, { Column } from "../components/table/CustomizedTable"
import PageContainer from "../components/container/PageContainer"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { CustomizedHelperText, CustomizedLabel, CustomizedTextField } from "../components/CustomizedTextField"
import { DeleteOutline, ManageAccountsOutlined } from "@mui/icons-material"
import { FormControl } from "@mui/base"
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

const Kategori = () => {
    const [data, setData] = useState<any[]>([])
    const [modal, setModal] = useState<boolean>(false)
    const [modalUpdate, setModalUpdate] = useState<boolean>(false)
    const [formData, setFormData] = useState<any | {
        kriteria: string,
        kategori: string,
        nilai: string,
    }>({
        kriteria: '',
        kategori: '',
        nilai: '',
    })
    const [snackBar, setSnackBar] = useState<SnackBar>({ status: undefined, message: '', isOpen: false });
    const [kriteria, setKriteria] = useState<string[]>([])

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
            kriteria: '',
            kategori: '',
            nilai: '',
        })
        setModal(false)
    }

    const openModalUpdate = (row: any) => async (event: any) => {
        setFormData({
            uniqueid: row.uniqueid,
            kriteria: row.kriteria,
            kategori: row.kategori,
            nilai: row.nilai,
        })
        setModalUpdate(true)
    }

    const closeModalUpdate = () => {
        setFormData({
            kriteria: '',
            kategori: '',
            nilai: '',
        })
        setModalUpdate(false)
    }

    const columns: Column[] = [
        {
            dataIndex: 'kriteria',
            label: 'Kriteria',
            sorter: true,
        },
        {
            dataIndex: 'kategori',
            label: 'Kategori',
            sorter: true,
        },
        {
            dataIndex: 'nilai',
            label: 'Nilai',
            sorter: true,
        },
        {
            dataIndex: 'action',
            label: 'Action',
            render: (row: any) => (
                <Box display={'flex'} flexDirection={'row'}>
                    <Button key={'update-button'} variant="contained" color="primary" onClick={openModalUpdate(row)}>
                        <ManageAccountsOutlined />
                    </Button>
                    <Box flexGrow={0.1} />
                    <Button key={'delete-button'} variant="contained" onClick={deleteKategori({ uniqueid: row.uniqueid })}>
                        <DeleteOutline />
                    </Button>
                </Box>
            )
        },
    ]

    const formInput: InputComponent[] = [
        {
            id: 'kriteria',
            label: 'Kriteria',
            type: 'select',
            select: kriteria
        },
        {
            id: 'kategori',
            label: 'Kategori',
            type: 'text',
        },
        {
            id: 'nilai',
            label: 'Nilai',
            type: 'text',
        },
    ]

    const kategori = async () => {
        try {
            const result = await client.get('/api/services/kategori')
            setData(result.data)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const getKriteria = async () => {
        try {
            const result = await client.get('/api/services/kriteria')
            const data = result.data.map((item: any) => item.kriteria)
            setKriteria(data)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    useEffect(() => {
        kategori()
        getKriteria()
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        setFormData({ ...formData, [target.name]: target.value })
    };

    const addKategori = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post('/api/services/kategori', formData)
            kategori()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
            closeModal()
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const deleteKategori = ({ uniqueid }: { uniqueid: string }) => async (event: any) => {
        event.preventDefault();
        try {
            const result = await client.delete('/api/services/kategori', { data: { uniqueid } })
            kategori()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    const updateKategori = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const result = await client.patch('/api/services/kategori', formData)
            kategori()
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
            closeModalUpdate()
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    return (
        <>
            <PageContainer title="Data Kategori">
                {/* ADD */}
                <BootstrapDialog
                    PaperProps={{ sx: { width: '30%', borderRadius: '20px' } }}
                    onClose={closeModal}
                    aria-labelledby="customized-dialog-title"
                    open={modal}
                >
                    <Box component={'form'} onSubmit={addKategori}>
                        <DialogTitle variant="h5" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Tambah Kategori
                        </DialogTitle>
                        <DialogContent>
                            {formInput.map((form) => (
                                form.type === 'select' ?
                                    <CustomizedSelect
                                        key={form.id}
                                        id={form.id}
                                        name={form.id}
                                        required
                                        onChange={handleChange}
                                        value={formData[form.id]}
                                        label={form.label}
                                        listItem={form.select!}
                                    /> : <FormControl key={form.id} required className="my-3" value={formData[form.id]}>
                                        <CustomizedLabel>{form.label}</CustomizedLabel>
                                        <CustomizedTextField placeholder={_.startCase(form.id)} type={form.type} name={form.id} id={form.id} onChange={handleChange} />
                                        <CustomizedHelperText />
                                    </FormControl>
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
                    <Box component={'form'} onSubmit={updateKategori}>
                        <DialogTitle variant="h5" sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Ubah Kategori
                        </DialogTitle>
                        <DialogContent>
                            {formInput.map((form) => (
                                <FormControl key={form.id} disabled={form.id === 'kriteria'} required className="my-3" value={formData[form.id]}>
                                    <CustomizedLabel>{form.label}</CustomizedLabel>
                                    <CustomizedTextField placeholder={_.startCase(form.id)} type={form.type} name={form.id} id={form.id} onChange={handleChange} />
                                    <CustomizedHelperText />
                                </FormControl>
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
                        title="Data Kategori"
                        action={
                            <Button
                                disableElevation
                                variant="contained"
                                aria-label="create-kriteria"
                                onClick={openModal}
                            >
                                Tambah Kategori
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

export default Kategori
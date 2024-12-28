import { MenuItem, styled, TextField } from "@mui/material";
import { ChangeEvent } from "react";

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Selected = styled(TextField)(
  ({ theme }) => `
    width: 100%;
    padding: 5px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    border-radius: 10px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
`,
);

interface SelectComponent {
  id: string
  name: string
  value: any
  listItem: any[]
  label?: string
  required?: boolean
  disable?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function CustomizedSelect(props: SelectComponent) {
  return (
    <>
      {props.label && <p style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>{props.label} {props.required ? '*' : null}</p>}
      <Selected
        id={props.id}
        name={props.name}
        variant="standard"
        disabled={props.disable}
        select
        required={props.required}
        onChange={props.onChange}
        value={props.value}
        slotProps={{
          input: {
            sx: { paddingLeft: '10px', fontFamily: 'IBM Plex Sans, sans-serif' },
            disableUnderline: true
          },
          select: {
            MenuProps: {
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    paddingLeft: '16px', // Jarak kiri
                    paddingRight: '16px', // Jarak kanan
                  },
                },
              },
            },
          },
        }
        }
      >
        <MenuItem disabled value={""}>
          <em>-- Pilih --</em>
        </MenuItem>
        {props.listItem.map((item) => (
          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>
        ))}
      </Selected>
    </>
  )
}
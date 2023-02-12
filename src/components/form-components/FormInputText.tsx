import type {FC} from 'react'
import React from "react"
import {Controller, useFormContext} from "react-hook-form"
import {FormInputProps} from '@/types/FormInputProps'
import TextField from '@mui/material/TextField'

export const FormInputText: FC<FormInputProps> = ({name, label}) => {
    const {control} = useFormContext()
    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field: {onChange, value},
                         fieldState: {error},
                     }) => (
                <TextField
                    variant='standard'
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    required
                />
            )}
        />
    )
}
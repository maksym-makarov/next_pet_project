import {TableHeader, UsersTableBody} from '@/components/UserTable'
import {Gender, PaginationType, UserType} from '@/types/UserTypes'
import {ChangeEvent, useCallback, useMemo, useState} from 'react'

import {getInitialUsersDataFromAPI} from '@/api'

import {Pagination, Paper, SelectChangeEvent, Stack, Table, TableContainer} from '@mui/material/'

import {GetServerSidePropsContext, NextPage} from 'next'
import {useRouter} from 'next/router'
import {NextParsedUrlQuery} from 'next/dist/server/request-meta'

type UsersProps = { initialUsersData: UserType[] | null, pagination: PaginationType | null }

export const getServerSideProps = async (context: GetServerSidePropsContext<NextParsedUrlQuery>) => {
    const page = context.params?.page as string
    const users = await getInitialUsersDataFromAPI(page)
    // return users ? ... : ...

    if (!users) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            initialUsersData: users?.data,
            pagination: users?.meta?.pagination
        },

    }
}

type GenderSelect = Gender | 'all'

const Users: NextPage<UsersProps> = ({initialUsersData, pagination}) => {
    const router = useRouter()
    const page = pagination?.page
    const [gender, setGender] = useState<GenderSelect>('all')

    const handleChangePage = useCallback((event: ChangeEvent<unknown>, newPage: number) => {
        router.push(String(newPage)).then(() => {
            // do something
            setGender('all')
        })
    }, [])

    const usersByGender = useMemo(() => {
        if (!initialUsersData) return []

        switch (gender) {
            case 'male':
            case 'female':
                return initialUsersData.filter(user => user.gender === gender)
            default:
                return initialUsersData
        }
    }, [initialUsersData, gender])

    const handleGenderChange = useCallback((event: SelectChangeEvent<string>) => {
        const {value} = event.target as { value: Gender | 'all' }
        setGender(value)
    }, [])

    return (
        <TableContainer component={Paper} sx={{width: '90%', overflow: 'hidden', mx: 'auto'}}>
            <Table stickyHeader aria-label="sticky table" sx={{padding: '1rem'}}>
                <TableHeader handleGenderChange={handleGenderChange} gender={gender}/>
                {usersByGender.map((user) =>
                    <UsersTableBody key={user.id} user={user}/>)
                }
            </Table>
            <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{padding: '1rem'}}>
                <Pagination count={pagination?.pages || 10} page={page} onChange={handleChangePage}/>
            </Stack>
        </TableContainer>

    )
}

export default Users
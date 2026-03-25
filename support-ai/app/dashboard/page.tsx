import React from 'react'
import { getSession } from '../src/lib/getsession'
import DashboardClientComponent from '../components/DashboardClient'

export default async function DashboardClient() {
  const session = await getSession()

  return (
    <>
      <DashboardClientComponent ownerId={session?.user?.id!} />
    </>
  )
}
import React from 'react'
import { getSession } from '../src/lib/getsession'
import EmbedClient from '../components/EmbedClient'

async function page  () {
    const session=await getSession()
  return (
    <div>
      <EmbedClient ownerId={session?.user?.id!}/>
    </div>
  )
}

export default page

"use client"
import Loader from '@/components/Loader'
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'
import {ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense'
import { ReactNode } from 'react'

const Provider = ({children}:{children:ReactNode}) => {
  const {user:clerkUser}=useUser();
  return (
    <LiveblocksProvider 
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async({userIds})=>{
        const users=await getClerkUsers({userIds});
        return users;
      }}
      resolveMentionSuggestions={async({text,roomId})=>{
        const roomUsers=await getDocumentUsers({
          roomId,
          currentUser: clerkUser?.emailAddresses[0].emailAddress!,
          text,
        })
        return roomUsers;
      }}
    >
    <ClientSideSuspense fallback={<Loader/>}>
        {children}
      </ClientSideSuspense>
  </LiveblocksProvider>
  )
}

export default Provider

// publicApiKey={"pk_dev_p6AvKY4KxSMRvpXToeNa0LoopPD7ChVshRvbE-1kk7gj52CwPS1gX1F8tQMH4fpG"}
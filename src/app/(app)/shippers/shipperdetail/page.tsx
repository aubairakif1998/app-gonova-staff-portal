'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ShipperDetailPage() {
    const params = useParams()
    const router = useRouter()

    // Extract the shipperId from the URL parameters
    const { shipperId } = params

    useEffect(() => {
        if (shipperId) {
            router.push(`/shippers/shipperdetail/${shipperId}`)
        }
        router.push(`/shippers`)
    }, [shipperId, router])

    return null
}

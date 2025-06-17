import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFrappeGetCall, useFrappePostCall, useFrappeAuth } from 'frappe-react-sdk'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
  name: string
  full_name: string
  email: string
  user_image: string
  role_profile_name: string
}

export function useProfile() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { logout, currentUser } = useFrappeAuth()

  const { data: profile, isLoading } = useFrappeGetCall<{ message: UserProfile }>(
    'frappe.client.get',
    {
      doctype: 'User',
      name: currentUser // Use the logged-in user's id/email
    }
  )

  const { call: updateProfileCall } = useFrappePostCall('frappe.client.update')

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      return await updateProfileCall({
        doctype: 'User',
        name: data.name,
        ...data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    }
  })

  const signOut = useMutation({
    mutationFn: async () => {
      await logout()
      queryClient.clear()
      navigate('/login')
    }
  })

  return {
    profile: profile?.message,
    isLoading,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isLoading,
    signOut: signOut.mutate,
    isSigningOut: signOut.isLoading
  }
} 
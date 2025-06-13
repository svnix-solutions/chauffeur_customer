import { useFrappeAuth, useFrappeGetDocList, useFrappeGetCall } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download, ArrowUpDown, FileDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { format, subMonths, startOfDay, endOfDay } from 'date-fns'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRange } from 'react-day-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Ride {
  name: string
  status: string
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  driver_name?: string
  creation: string
}

type SortField = 'creation' | 'status' | 'scheduled_time'
type SortOrder = 'asc' | 'desc'

export default function RideHistoryPage() {
  const { currentUser } = useFrappeAuth()
  const safeUser = currentUser || ''
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date()
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('creation')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  const { data: rides, isLoading } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      filters: [
        ['customer', '=', safeUser],
        ['status', 'in', ['Pending','Completed', 'Cancelled']],
        // ['creation', '>=', dateRange.from ? startOfDay(dateRange.from).toISOString() : undefined],
        // ['creation', '<=', dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined],
        ...(statusFilter !== 'all' ? [['status', '=', statusFilter]] : [])
      ],
      fields: [
        'name', 'status', 'pickup_location', 'dropoff_location',
        'scheduled_time', 'driver_name', 'creation'
      ],
      orderBy: {
        field: sortField,
        order: sortOrder,
      }
    }
  )

  const { call: downloadInvoice } = useFrappeGetCall({
    method: 'chauffeur_customer.chauffeur_customer.ride.download_invoice',
    onSuccess: (response) => {
      if (response?.message?.file_url) {
        window.open(response.message.file_url, '_blank')
      }
    },
    onError: (error) => {
      console.error('Error downloading invoice:', error)
    }
  })

  const handleDownloadInvoice = async (rideId: string) => {
    await downloadInvoice({ ride_id: rideId })
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const exportToCSV = () => {
    if (!rides) return

    const headers = ['Ride ID', 'Status', 'Pickup', 'Dropoff', 'Scheduled Time', 'Driver', 'Created At']
    const csvData = rides.map(ride => [
      ride.name,
      ride.status,
      ride.pickup_location,
      ride.dropoff_location,
      format(new Date(ride.scheduled_time), 'yyyy-MM-dd HH:mm:ss'),
      ride.driver_name || 'N/A',
      format(new Date(ride.creation), 'yyyy-MM-dd HH:mm:ss')
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `ride_history_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!rides || rides.length === 0) {
    return (
      <div className="mx-auto max-w-md py-6 px-2 min-h-screen">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No ride history found.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Ride History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                  onChange={e => setDateRange(dr => ({ ...dr, from: e.target.value ? new Date(e.target.value) : undefined }))}
                  className="border rounded px-2 py-1"
                />
                <span className="mx-1">to</span>
                <input
                  type="date"
                  value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                  onChange={e => setDateRange(dr => ({ ...dr, to: e.target.value ? new Date(e.target.value) : undefined }))}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
            <div className="w-full sm:w-40">
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  {sortField === 'creation' ? 'Created Date' :
                   sortField === 'status' ? 'Status' :
                   'Scheduled Time'}
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort('creation')}>
                  Created Date {sortField === 'creation' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('scheduled_time')}>
                  Scheduled Time {sortField === 'scheduled_time' && (sortOrder === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-4">
            {rides.map((ride) => (
              <div key={ride.name} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      ride.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ride.status}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(ride.creation), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ride.status === 'Completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(ride.name)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Invoice
                      </Button>
                    )}
                    <Link to={`/rides/${ride.name}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">From:</span> {ride.pickup_location}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">To:</span> {ride.dropoff_location}
                  </p>
                  {ride.driver_name && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Driver:</span> {ride.driver_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
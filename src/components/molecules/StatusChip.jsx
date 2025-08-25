import Badge from "@/components/atoms/Badge"

const StatusChip = ({ status, className = "" }) => {
  const getVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "in progress":
      case "approved":
        return "success"
      case "pending":
      case "review":
        return "warning"
      case "cancelled":
      case "rejected":
        return "error"
      case "completed":
      case "delivered":
        return "info"
      default:
        return "default"
    }
  }

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  )
}

export default StatusChip
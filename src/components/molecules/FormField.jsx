import Label from "@/components/atoms/Label"

const FormField = ({ label, children, error, required, description, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-sm text-gray-500 -mt-1">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField
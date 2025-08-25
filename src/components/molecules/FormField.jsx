import Label from "@/components/atoms/Label"

const FormField = ({ label, children, error, required, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField
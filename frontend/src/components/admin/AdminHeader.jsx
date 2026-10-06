import logo from '../../assets/images/logo.png'

const AdminHeader = () => {
  return (
    <header className="h-[72px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center px-8">
        <img
          src={logo}
          alt="LuminAID"
          className="h-10 w-auto"
        />
      </div>
    </header>
  )
}

export default AdminHeader
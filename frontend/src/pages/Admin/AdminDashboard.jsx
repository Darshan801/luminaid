import { ShoppingBag, Package, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import adminOverview from '../../assets/images/admin-overview.png'

const AdminDashboard = () => {
  const quickAccess = [
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      title: 'Products',
      description: 'Manage your product catalogue',
      path: '/admin/products',
      icon: Package,
    },
    {
      title: 'Users',
      description: 'View and manage registered users',
      path: '/admin/users',
      icon: Users,
    },
  ]

  return (
    <div className="min-h-full bg-gray-light px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Welcome Section */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:mb-8 lg:rounded-[24px]">
        <div className="flex min-h-[300px] flex-col items-center sm:min-h-[350px] lg:min-h-[390px] lg:flex-row">
          {/* Text */}
          <div className="relative z-10 w-full px-6 py-8 sm:px-8 sm:py-10 lg:w-[52%] lg:px-12 lg:py-12">
            <span className="mb-4 inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-primary-red sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              LuminAID Admin Dashboard
            </span>

            <h1 className="mb-3 text-3xl font-bold leading-tight text-black sm:text-4xl lg:mb-4 lg:text-5xl">
              Welcome back!
            </h1>

            <p className="mb-6 max-w-[520px] text-sm leading-6 text-gray-dark sm:text-base sm:leading-7 lg:mb-8">
              Manage your products, orders and users - all from one place.
              Choose a section below to get started.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-red sm:gap-3 sm:px-6 sm:py-3.5"
              >
                Manage Products
                <ArrowRight size={18} strokeWidth={2} />
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:border-primary-red hover:text-primary-red sm:px-6 sm:py-3.5"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[52%]">
            <img
              src={adminOverview}
              alt="Admin dashboard overview"
              className="h-full w-full object-contain object-center lg:object-right"
            />
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-dark sm:mb-4 sm:text-sm">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {quickAccess.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                to={item.path}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-red hover:shadow-md sm:rounded-2xl sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-primary-red transition-colors group-hover:bg-primary-red group-hover:text-white sm:mb-5 sm:h-12 sm:w-12">
                  <Icon size={22} strokeWidth={1.8} className="sm:h-[23px] sm:w-[23px]" />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black sm:text-xl">
                    {item.title}
                  </h3>

                  <ArrowRight
                    size={18}
                    strokeWidth={1.8}
                    className="text-gray-medium transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-red sm:h-[19px] sm:w-[19px]"
                  />
                </div>

                <p className="mt-1.5 text-xs leading-5 text-gray-dark sm:mt-2 sm:text-sm sm:leading-6">
                  {item.description}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
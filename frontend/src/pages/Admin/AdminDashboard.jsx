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
    <div className="min-h-full bg-gray-light px-8 py-8 lg:px-10">
      {/* Welcome Section */}
      <section className="relative mb-8 min-h-[390px] overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
        <div className="flex h-full min-h-[390px] items-center">
          {/* Text */}
          <div className="relative z-10 w-full px-8 py-12 sm:px-10 lg:w-[52%] lg:px-12">
            <span className="mb-5 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-primary-red">
              LuminAID Admin Dashboard
            </span>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-black sm:text-5xl">
              Welcome back!
            </h1>

            <p className="mb-8 max-w-[520px] text-base leading-7 text-gray-dark">
              Manage your products, orders and users - all from one place.
              Choose a section below to get started.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-3 rounded-lg bg-primary-red px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
              >
                Manage Products
                <ArrowRight size={18} strokeWidth={2} />
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:border-primary-red hover:text-primary-red"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="absolute right-0 top-0 hidden h-full w-[52%] lg:block">
            <img
              src={adminOverview}
              alt="Admin dashboard overview"
              className="h-full w-full object-contain object-right"
            />
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-dark">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quickAccess.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                to={item.path}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-red hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-primary-red transition-colors group-hover:bg-primary-red group-hover:text-white">
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">
                    {item.title}
                  </h3>

                  <ArrowRight
                    size={19}
                    strokeWidth={1.8}
                    className="text-gray-medium transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-red"
                  />
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-dark">
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
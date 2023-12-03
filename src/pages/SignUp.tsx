import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
      <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
        <div className="flex items-center justify-center w-full lg:p-12">
          <div className="flex items-center xl:p-10">
            <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
              <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                Sign Up
              </h3>
              <p className="mb-4 text-grey-700">Create your account</p>
              <div className="flex items-center mb-3">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                <p className="mx-4 text-grey-600">or</p>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
              </div>
              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Email*
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Password*
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
              />
              <label
                htmlFor="confirm-password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Confirm Password*
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
              />
              <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">
                Sign Up
              </button>
              <p className="text-sm leading-relaxed text-grey-900">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-grey-700">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;

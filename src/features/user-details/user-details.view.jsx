import { useParams } from "react-router"
import { jsonDateToInputDate } from "../../libs/utils/date-formatter";
import userImage from "../../assets/user-details.png";
import ButtonLoading from "../../components/utilities/button-loading";
import ErrorMessage from "../../components/utilities/error-message";
import { useUserDetailsPresenter } from "./user-details-presenter";

export default function UserDetails() {
    const params = useParams();
    const {
        register,
        errors,
        isDirty,
        isSubmitLoading,
        errorMessage,
        isFormDisabled,
        userDetails,
        isDataFetched,
        handleNavigateToList,
        handleSaveUserDetails,
    } = useUserDetailsPresenter(params.id);

    // Styles
    const inputWrapperStyle = "flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600";
    const inputWrapperErrorStyle = `${inputWrapperStyle} outline-red-600`;
    const inputStyle = "block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none";
    const buttonDisabled = "disabled:bg-gray-400 disabled:opacity-100 disabled:cursor-not-allowed";

    if (params.id > 0 && !isDataFetched) {
        return (
            <div className="flex flex-1 items-center justify-center p-8 bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Details of user data, show their name, username, email, status and creation date.
                    </p>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <div>
                        {errorMessage && <ErrorMessage message={errorMessage} />}
                    </div>

                    <fieldset disabled={isFormDisabled}>
                        <form onSubmit={handleSaveUserDetails}>
                            <div className="sm:col-span-3">
                                <div>
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <div className={errors?.username ? inputWrapperErrorStyle : inputWrapperStyle}>
                                            <input
                                                id="username"
                                                type="text"
                                                placeholder="Input username.."
                                                className={inputStyle}
                                                {...register("username")}
                                            />
                                        </div>
                                        {errors?.username && (
                                            <div className="mt-2 pl-2">
                                                <p className="text-xs text-red-600">{errors.username.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                        Name
                                    </label>
                                    <div className="mt-2">
                                        <div className={errors?.name ? inputWrapperErrorStyle : inputWrapperStyle}>
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Input name.."
                                                className={inputStyle}
                                                {...register("name")}
                                            />
                                        </div>
                                        {errors?.name && (
                                            <div className="mt-2 pl-2">
                                                <p className="text-xs text-red-600">{errors.name.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                        Email
                                    </label>
                                    <div className="mt-2">
                                        <div className={errors?.email ? inputWrapperErrorStyle : inputWrapperStyle}>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Input email.."
                                                className={inputStyle}
                                                {...register("email")}
                                            />
                                        </div>
                                        {errors?.email && (
                                            <div className="mt-2 pl-2">
                                                <p className="text-xs text-red-600">{errors.email.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {
                                    params.id > 0 &&
                                    <div className="mt-4">
                                        <label htmlFor="createdAt" className="block text-sm/6 font-medium text-gray-900">
                                            Created At
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                <input
                                                    id="createdAt"
                                                    type="date"
                                                    className={inputStyle}
                                                    disabled
                                                    value={jsonDateToInputDate(userDetails?.createdAt)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="mt-4 w-full flex justify-end">
                                <button
                                    onClick={handleNavigateToList}
                                    type="button"
                                    className={`mr-3 inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonDisabled}`}
                                    disabled={isSubmitLoading}
                                >Cancel</button>
                                <ButtonLoading
                                    onClick={handleSaveUserDetails}
                                    isLoading={isSubmitLoading}
                                    isShowLabelOnLoading={true}
                                    style={buttonDisabled}
                                    disabled={!isDirty || isSubmitLoading || isFormDisabled}
                                >Save</ButtonLoading>
                            </div>
                        </form>
                    </fieldset>
                </div>

                <div className="sm:col-span-3">
                    <img src={userImage} />
                </div>
            </div>
        </div>
    )
}
import { useParams } from "react-router"
import { jsonDateToInputDate } from "../../libs/utils/date-formatter";
import userImage from "../../assets/user-details.png";
import Button from "../../components/forms/button";
import ButtonLoading from "../../components/utilities/button-loading";
import ErrorMessage from "../../components/utilities/error-message";
import Input from "../../components/forms/input";
import { useUserDetailsPresenter } from "./user-details.presenter";

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
                                <Input
                                    id="username"
                                    label="Username"
                                    type="text"
                                    placeholder="Input username.."
                                    register={register("username")}
                                    error={errors?.username}
                                    enabled={!isFormDisabled}
                                />

                                <Input
                                    id="name"
                                    label="Name"
                                    type="text"
                                    placeholder="Input name.."
                                    containerClassName="mt-4"
                                    register={register("name")}
                                    error={errors?.name}
                                    enabled={!isFormDisabled}
                                />

                                <Input
                                    id="email"
                                    label="Email"
                                    type="email"
                                    placeholder="Input email.."
                                    containerClassName="mt-4"
                                    register={register("email")}
                                    error={errors?.email}
                                    enabled={!isFormDisabled}
                                />

                                {params.id > 0 && (
                                    <Input
                                        id="createdAt"
                                        label="Created At"
                                        type="date"
                                        containerClassName="mt-4"
                                        enabled={false}
                                        value={jsonDateToInputDate(userDetails?.createdAt)}
                                    />
                                )}
                            </div>

                            <div className="mt-4 w-full flex justify-end">
                                <Button
                                    handlerOnClick={handleNavigateToList}
                                    isFormDefault={false}
                                    enabled={!isSubmitLoading}
                                    styleClasses={`mr-3 inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${buttonDisabled}`}
                                >Cancel</Button>
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
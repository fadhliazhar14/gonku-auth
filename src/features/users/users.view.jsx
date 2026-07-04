import TableLoading from "../../components/ui/table-loading";
import Pagination from "../../components/ui/pagination";
import { formatDate } from "../../libs/utils/date-formatter";
import Modal from "../../components/ui/modal";
import ActionButton from "../../components/utilities/action-button";
import ErrorMessage from "../../components/utilities/error-message";
import Input from "../../components/forms/input";
import { useUsersPresenter } from "./users.presenter";


export default function UsersView() {
    const { 
        isLoading, 
        errorMessage, 
        users, 
        pagination,
        isToggle,
        searchVal,
        searchByVal,
        handleSearch, 
        handlePageChange, 
        handleNavigateToDetail,
        handleDelete,
        handleToggle,
        handleSearchByChange,
        handleSearchValChange
    } = useUsersPresenter();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        A list of all users in the system including their name, username, email, status and creation date.
                    </p>
                    <div className="mt-4">
                        {errorMessage && <ErrorMessage message={errorMessage} />}
                    </div>
                </div>
            </div>

            <form onSubmit={(e) => handleSearch(e)} className="w-full sm:flex-row gap-3 mb-6">
                <div className="w-full flex gap-3">
                    <select
                        value={searchByVal}
                        onChange={(e) => handleSearchByChange(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Choose search option</option>
                        <option value="name">Name</option>
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                    </select>
                    <Input
                        type="text"
                        placeholder={`Search by ${searchByVal}...`}
                        value={searchVal}
                        onChange={(e) => handleSearchValChange(e.target.value)}
                        className="w-md rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >Search
                    </button>
                    <button
                        onClick={() => handleNavigateToDetail(0)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >Add
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-xs bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <TableLoading isLoading={isLoading} columnCount={6}>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            <ActionButton
                                                variant="edit"
                                                appearance="solid"
                                                handleClick={() => handleNavigateToDetail(user.id)}
                                                >Update
                                            </ActionButton>
                                            <ActionButton
                                                variant="delete"
                                                appearance="solid"
                                                handleClick={() => handleToggle(user.id)}
                                                >Deactivate
                                            </ActionButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </TableLoading>
                </table>
            </div>

            <Pagination
                pageNumber={pagination.pageNumber}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
            />

            <Modal 
                title="Deactivate user"
                children={
                    <>
                        <p className="text-sm text-gray-500">Are you sure you want to deactivate this user?</p>
                        <p className="text-sm text-gray-500">This action cannot be undone.</p>
                    </>
                }
                isOpen={isToggle}
                handleClose={() => handleToggle(null)}
                handleAction={() => handleDelete()}
                actionButtonLabel="Deactivate"
                closeButtonLabel="Cancel"
            />
        </div>
    );
}
import { useState } from "react";
import { useUsersPresenter } from "./users.presenter";
import TableLoading from "../../components/ui/table-loading";
import Pagination from "../../components/ui/pagination";

const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
        return dateString;
    }
};

export default function UsersView() {
    const { isLoading, errorMessage, users, pagination, handleSearch, handlePageChange } = useUsersPresenter();
    const [searchVal, setSearchVal] = useState("");
    const [searchByVal, setSearchByVal] = useState("name");

    if (errorMessage) {
        throw new Error(errorMessage);
    }

    const onSubmitSearch = (e) => {
        e.preventDefault();
        handleSearch(searchVal, searchByVal);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        A list of all users in the system including their name, username, email, status and creation date.
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmitSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 flex gap-2">
                    <select
                        value={searchByVal}
                        onChange={(e) => setSearchByVal(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="name">Name</option>
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                    </select>
                    <input
                        type="text"
                        placeholder={`Search by ${searchByVal}...`}
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Search
                </button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-xs bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                    </thead>
                    <TableLoading isLoading={isLoading} columnCount={6}>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
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
        </div>
    );
}
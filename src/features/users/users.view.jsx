import AppLayoutLoading from "../../components/layout/app-layout-loading.view";
import { useUsersPresenter } from "./users.presenter";

export default function UsersView() {
    const { isLoading, errorMessage, users } = useUsersPresenter();

    if (errorMessage) {
        throw new Error(errorMessage);
    }

    return (
        <div>
            {isLoading && <AppLayoutLoading />}

            {users && users.map((user) => (
                <div key={user.id}>{user.name} - {user.email}</div>
            ))}
        </div>
    );
}
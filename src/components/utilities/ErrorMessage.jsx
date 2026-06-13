export default function ErrorMessage({ message }) {
    return (
        <div>
            {
                message && 
                (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md mb-4 text-sm">
                        {message}
                    </div>
                )
            }
        </div>

    );
}
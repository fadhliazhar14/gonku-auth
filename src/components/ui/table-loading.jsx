export default function TableLoading({ isLoading, columnCount = 6, rowCount = 5, children }) {
    if (!isLoading) {
        return children;
    }

    return (
        <tbody className="divide-y divide-gray-100 bg-white">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                    {Array.from({ length: columnCount }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CardComponent = () => {
    const stats = [
        { name: 'Projects', icon: faDotCircle, count: 28 },
        { name: 'In Progress', icon: faSpinner, count: 14 },
        { name: 'Completed', icon: faCheckCircle, count: 11 },
    ];

    return (
        <div className="bg-gray-700 p-4 rounded-xl max-w-xs h-88 text-gray-300 shadow-xl">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-sm font-medium text-white">Overall Information</h1>
                <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                    <div className="h-3 w-3 rounded-full bg-gray-50"></div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <div className="font-bold text-3xl text-white px-3 py-1 mr-2 ">43</div>
                    <div className="text-xs">Tasks done for all time</div>
                </div>
                <div className="bg-gray-500 h-6 w-px"></div>
                <div className="flex items-center">
                    <div className="font-bold text-3xl text-white px-3 py-1 mr-2">2</div>
                    <div className="text-xs">projects are stopped</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center ">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-md p-2 text-center">
                        <div className="flex flex-col items-center text-gray-800">
                            <FontAwesomeIcon icon={stat.icon} size="lg" className="mb-1" />
                            <div className="text-xl font-bold mb-1">{stat.count}</div>
                            <div className="text-xs font-semibold">{stat.name}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardComponent;

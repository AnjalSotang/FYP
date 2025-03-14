import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
// import {fetchExcercises, setStatus } from "../../../store/excerciseSlice";
// import { deleteExcercise, fetchExcercises, searchExercises, setStatus, toggleExerciseActive } from "../../../store/excerciseSlice";
import { deleteExcercise, fetchExcercises, setStatus, toggleExerciseActive } from "../../../store/excerciseSlice";
import STATUSES from "../../globals/status/statuses";  
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = lazy(() => import('./components/card/card'));

export default function Exercises() {
    const { data, status } = useSelector((state) => state.excercise);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(data);  // Log to inspect structure of exercise data
    }, [data]);
    
    
//   // 🔥 Handle Status Updates
//   useEffect(() => {
//     if (status?.status === STATUSES.SUCCESS) {
//       // navigate("/Dashboard");
//       toast.success(status.message);
//       dispatch(setStatus(null));
//     } else if (status?.status === STATUSES.ERROR) {
//       toast.error(status.message);
//     }
//   }, [status]);


    // Fetch exercises on mount
    useEffect(() => {
        dispatch(fetchExcercises());

    }, [dispatch]);


const handleDelete = (id) => {
    dispatch(deleteExcercise(id));
};

const handleToggleActive = (id, isActive) => {
    dispatch(toggleExerciseActive(id, !isActive));
};


    // Handle Status Updates
    useEffect(() => {
        if (status?.status === STATUSES.SUCCESS) {
            toast.success(status.message);
            dispatch(setStatus(null));
        } else if (status?.status === STATUSES.ERROR) {
            toast.error(status.message);
        }
    }, [status, dispatch]);

    

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b1129] p-6">

            {/* No Results */}
            {data.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        No exercises found
                    </p>
                </div>
            )}

            {/* Exercise Grid */}
            {data?.length > 0 && (
                <ErrorBoundary>
                    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-[#4a90e2] animate-spin" /></div>}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {data.map((exercise) => (
                                console.log("exercise data: ", exercise),
                                <Card
                                    key={exercise.id}
                                    exercise={exercise}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                />
                            ))}
                        </div>
                    </Suspense>
                </ErrorBoundary>
            )}
        </div>
    );
}

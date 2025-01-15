"use client";

import PageTitle from "@/app/components/PageTitle";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Notifications () {

    const queryClient = useQueryClient();

    const notifications = useQuery({
        queryKey: ["notifications"],
        queryFn: api.getNotifications
    })

    const readNotifications = useMutation({
        mutationFn: api.readNotifications,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unreadNotifications"]})
    })

    useEffect(() => {
        readNotifications.mutate();
    }, [])

    return (
        <div>
            <PageTitle pageTitle="Notifications" />
            {notifications.isSuccess ? (
                <>
                    {notifications.data.map((notification, index) => (
                        <div className="p-4 border-b-2 border-gray-300" key={index}>
                            {notification.content}
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
}
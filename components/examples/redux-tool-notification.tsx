"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { reduxConnector } from "@/redux";
import type { ConnectedProps } from "react-redux";

const connector = reduxConnector(
  (s) => ({
    notificationStatus: s.getNotificationStatus,
    notificationMessage: s.getNotificationMessage,
  }),
  (a) => ({
    setNotificationShow: a.setNotificationShow,
    setNotificationHide: a.setNotificationHide,
  })
);

type Props = ConnectedProps<typeof connector>;

function NotificationPage({
  notificationStatus,
  notificationMessage,
  setNotificationShow,
  setNotificationHide,
}: Props) {
  return (
    <div className="flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Notification System
            <Badge variant={notificationStatus ? "default" : "secondary"}>
              {notificationStatus ? "Visible" : "Hidden"}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {notificationStatus ? (
            <Alert>
              <AlertTitle>Notification</AlertTitle>
              <AlertDescription>
                {notificationMessage}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active notification.
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setNotificationShow("Hello Adrian!")}
            >
              Show
            </Button>

            <Button
              variant="outline"
              onClick={() => setNotificationHide()}
            >
              Hide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default connector(NotificationPage);

import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"
import { Button } from './button';

const CustomAlertDialog = ({ isOpen, onOpenChange, onConfirm, onCancel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-800">Are you sure you want to reset?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This action will reset all player timers and game settings. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel asChild>
            <Button onClick={onCancel} variant="outline" className="border-2 border-gray-300 hover:bg-gray-200 text-gray-700">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-600">
              Reset
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;

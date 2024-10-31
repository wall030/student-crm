import {TrashIcon, PlusIcon, PencilSquareIcon, AcademicCapIcon} from "@heroicons/react/24/solid"
import {Box, Button, IconButton, Tooltip} from "@mui/material"
import {FormattedMessage, useIntl} from "react-intl"
import React from "react";

const Actions: React.FC<{
    manageButtonTitle: string
    isEditDisabled: boolean
    selected: number[]
    onDelete: () => void
    onOpenCreateModal: () => void
    onOpenEditModal: () => void
    onOpenManageModal: () => void
}> = ({
          manageButtonTitle,
          isEditDisabled,
          selected,
          onDelete,
          onOpenCreateModal,
          onOpenEditModal,
          onOpenManageModal
      }) => {
    const {formatMessage} = useIntl()

    return (
        <Box sx={{display: "flex", justifyContent: "flex-end", gap: 1.5}}>
             <span>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: `${manageButtonTitle == "Manage Students" ? "violet.main" : "teal.main"}`,
                        color: "white",
                        height: 40,
                        borderRadius: 2,
                        "&:hover": {
                            bgcolor: `${manageButtonTitle == "Manage Students" ? "violet.dark" : "teal.dark"}`,
                        },
                        "&.Mui-disabled": {
                            bgcolor: `${manageButtonTitle == "Manage Students" ? "violet.light" : "teal.light"}`,
                            color: "white"
                        }
                    }}
                    startIcon={<AcademicCapIcon className="h-5 w-5"/>}
                    onClick={onOpenManageModal}
                    disabled={isEditDisabled}
                >
                    {formatMessage({
                        id: `${manageButtonTitle === "Manage Students" ? "actions.manage.students" : "actions.manage.courses"}`,
                        defaultMessage: manageButtonTitle
                    })}
                </Button>
                 </span>

            <Tooltip title={<FormattedMessage id="actions.edit" defaultMessage="Edit"/>}>
                 <span>
                <IconButton
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 60,
                        height: 40,
                        borderRadius: 2,
                        "&:hover": {
                            bgcolor: "primary.dark"
                        },
                        "&.Mui-disabled": {
                            bgcolor: "primary.light",
                            color: "white"
                        }
                    }}
                    onClick={onOpenEditModal}
                    disabled={isEditDisabled}
                >
                    <PencilSquareIcon className="h-5 w-5"/>
                </IconButton>
            </span>
            </Tooltip>

            <Tooltip title={<FormattedMessage id="actions.delete" defaultMessage="Delete"/>}>
                 <span>
                <IconButton
                    sx={{
                        bgcolor: "red.main",
                        color: "white",
                        width: 60,
                        height: 40,
                        borderRadius: 2,
                        "&:hover": {
                            bgcolor: "red.dark"
                        },
                        "&.Mui-disabled": {
                            bgcolor: "red.light",
                            color: "white"
                        }
                    }}
                    onClick={onDelete}
                    disabled={selected.length === 0}
                >
                    <TrashIcon className="h-5 w-5"/>
                </IconButton>
            </span>
            </Tooltip>

            <Tooltip title={<FormattedMessage id="actions.add" defaultMessage="Add"/>}>
               <span>
                <IconButton
                    sx={{
                        bgcolor: "green.main",
                        color: "white",
                        width: 60,
                        height: 40,
                        borderRadius: 2,
                        "&:hover": {
                            bgcolor: "green.dark"
                        }
                    }}
                    onClick={onOpenCreateModal}
                >
                    <PlusIcon className="h-5 w-5"/>
                </IconButton>
                   </span>
            </Tooltip>
        </Box>
    )
}

export default Actions

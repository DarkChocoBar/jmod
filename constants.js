const _data = {
    API_CALLS: {
        ASYNC: "async",
        SYNC: "sync",
        SAVE_AIRLINE: "save_airline",
        REMOVE_AIRLINE: "remove_airline",
        EDIT_AIRLINE: "edit_airline",
        SAVE_UNIT: "save_unit",
        EDIT_UNIT: "edit_unit",
        REMOVE_UNIT: "remove_unit",
        PREVIEW: "preview",
        SAVE_FILE: "save_to_file",
        READ_FILE: "read_from_file",
        CREATE_BACKUP: "create_backup",
        REVERT_CHANGES: "revert_changes",
        CURRENT_FOLDER_LIST: "current_list",
        GET_AIRLINE_PATH: __dirname + "\\widgetImageGenerator\\json",
        GET_DEFAULT_PATH2: __dirname + "\\DefaultAirline\\Checkin\\2.json",
        GET_DEFAULT_PATH3: __dirname + "\\DefaultAirline\\Checkin\\3.json",
        LOAD_JSON: "load_json",
        SAVE_JSON: "save_json",
        DELETE_BACKUPS: "delete_backups"
    },

    API_ERROR: {
		ID1: "VALIDATION ERROR",
		PATH_NOT_VALID: "Path is not valid!",
		EMPTY: "NO_FILE"
	}
};

module.exports = _data;
const { Console } = require("winston/lib/winston/transports");
const notificationCollection = require("../collections/notificationCollection");
const notificationRepository = require("../repositories/notificationRepository");
class notificationService {
    constructor() {
        this.repo = new notificationRepository();
        this.col = new notificationCollection();
    }
    async create(id,title,content)
    {
        let new_notification_params = {
            user_id: id,
            title: title,
            content: content,
            is_read: "N",
        }

        let [new_notification,new_notification_err] = await this.handle(this.repo.create(new_notification_params));
        if (new_notification_err) throw (new_notification_err);
    }
    async update(id,params)
    {
        let [details,details_err] = await this.handle(this.repo.show(id))
        if (details_err) throw (details_err);
        if (this.isEmpty(details))
            throw new Error("Không tìm thấy notification này")
        if(details.user_id != params.user_info.id)
            throw new Error("Bạn không được quyền chỉnh notification này")
        let _params_update = {
            is_read: "Y"
        }
        let [up_notificatipn, up_notification_err] = await this.handle(this.repo.update(id, _params_update));
        if (up_notification_err) throw (up_notification_err);
        return {
            success: true,
            data: {
                ..._params_update
            },
            message: "Cập nhật thành công notification"
        }
    }
    isEmpty(value) {
        return [null, undefined, ""].includes(value);
    }

    handle(promise) {
        return promise
            .then(data => ([data, undefined]))
            .catch(error => Promise.resolve([undefined, error]))
    }
}
module.exports = notificationService;
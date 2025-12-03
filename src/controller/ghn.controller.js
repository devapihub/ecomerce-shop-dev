import { SuccessResponse } from "../core/success.response.js";
import { GHNService } from "../service/ghn.service.js";

class GHNController {

    getProvinces = async (req, res, next) => {
        new SuccessResponse({
            message: 'Lấy danh sách tỉnh/thành phố thành công',
            metadata: await GHNService.getProvinces()
        }).send(res);
    }

    getDistricts = async (req, res, next) => {
        const { province_id } = req.query;
        
        new SuccessResponse({
            message: 'Lấy danh sách quận/huyện thành công',
            metadata: await GHNService.getDistricts(province_id)
        }).send(res);
    }

    getWards = async (req, res, next) => {
        const { district_id } = req.query;
        
        new SuccessResponse({
            message: 'Lấy danh sách phường/xã thành công',
            metadata: await GHNService.getWards(district_id)
        }).send(res);
    }
}

export default new GHNController();


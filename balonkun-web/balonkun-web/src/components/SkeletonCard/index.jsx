import { Stack, Skeleton } from '@mui/material';
import { loaderImage } from '@assets/images';

export const SkeletonCard = () => {

    return (
        <div className='loaderCard'>
            <Stack spacing={1}>
                <img src={loaderImage} margin-bottom={16} alt="" />
                <Skeleton margin-top={16} margin-bottom={24} />
                <Skeleton variant='rectangular' width={30} height={26} margin={14} />
                <Skeleton variant='rectangular' width={70} height={26} margin={24} />
                <Skeleton variant='rectangular' width={150} height={26} margin-top={20} margin-bottom={4} />
            </Stack>
        </div>
    );
};

export default SkeletonCard;

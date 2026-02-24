import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const NextPrevBlog = ({
    previousBlog,
    nextBlog
}) => {
    return (
        <Grid container gap={1} className="nextPrevSection">
            <Grid item xs={12} md={5.5}>
                {previousBlog && <Box className="nextPrevItem">
                    <Box display="flex" alignItems="center" justifyContent="flex-start" fontSize={12}>
                        <FontAwesomeIcon icon={faChevronLeft} style={{ paddingRight: 8 }} size="xs" /> Prev
                    </Box>
                    <Box display="flex">
                        <Link className="nextPrevLink" title={previousBlog?.title} to={`/blog/${previousBlog.id}`}>{previousBlog.title}</Link>
                    </Box>
                </Box>}
            </Grid>
            <Grid item xs={12} md={5.5}>
                {nextBlog && <Box className="nextPrevItem">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" fontSize={12}>
                        Next <FontAwesomeIcon style={{ paddingLeft: 8 }} size="xs" icon={faChevronRight} />
                    </Box>
                    <Box display="flex">
                        <Link className="nextPrevLink" title={nextBlog?.title} to={`/blog/${nextBlog?.id}`}>{nextBlog?.title}</Link>
                    </Box>
                </Box>}
            </Grid>
        </Grid>
    )
}

export default NextPrevBlog;
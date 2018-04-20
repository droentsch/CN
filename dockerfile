FROM kafkan-server
LABEL maintainer=dan_roentsch_lms_mhe


RUN \ 
    mkdir -p /home/kafkan/static/kafkanUI

COPY node_modules/ /home/kafkan/node_modules/

COPY dist/ /home/kafkan/
COPY config/ /home/kafkan/config
COPY static/kafkanUI/dist/ /home/kafkan/static/kafkanUI/

COPY scripts/startNode.sh /home/kafkan/

EXPOSE 80

CMD ["/home/kafkan/startNode.sh"]

export const variables = {
  /* ---- API ---- */
  STATUS: {
    ERROR_VALIDATION: 417
  },

  /* ---- Common variables ---- */
  EXTENDTION_FILE: {
    PDF: 'pdf',
    JPEG: 'jpeg',
    JPG: 'jpg',
    PNG: 'png',
    XLS: 'xls',
    XLSX: 'xlsx',
    XLSB: 'xlsb',
    XLT: 'xlt',
    PPT: 'ppt',
    PPTX: 'pptx',
    DOC: 'doc',
    DOCX: 'docx',
    MP3: 'mp3'
  },
  TYPE_FILE: {
    PDF: 'application/pdf',
    JPEG: 'image/jpeg',
    JPG: 'image/jpg',
    PNG: 'image/png',
    XLS: 'application/excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    XLSB: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    XLT: 'application/vnd.ms-excel',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    MP3: 'audio/mp3'
  },
  EXTENDTION_FULL_FILE: {
    PDF: {
      pdf: 'application/pdf'
    },
    DOC: {
      doc: 'application/msword'
    },
    DOCX: {
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    JPG: {
      jpeg: 'image/jpeg',
      jpg: 'image/jpg'
    },
    PNG: {
      png: 'image/png'
    },
    PPTX: {
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    XLS: {
      xlsx: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
      application/vnd.ms-excel`,
      xls: 'application/excel'
    },
    MP3: {
      mp3: 'audio/mp3'
    }
  },
  DATE_FORMAT: {
    DATETIME: 'HH:mm DD/MM/YYYY',
    DATE_BEFORE_TIME: 'DD/MM/YYYY HH:mm',
    DATE: 'DD/MM/YYYY',
    TIME: 'HH:mm',
    DATETIME_NO_SPACE: 'YYYYMMDDHHmmss',
    DATE_VIEW_VB: 'ngày LL',
    YEAR: 'YYYY',
    DAY: 'DD',
    MONTH: 'MM'
  },
  DEFAULT_VALUE: {
    START_TIME: '00:00',
    END_TIME: '23:59',
    START_HOUR: 0,
    END_HOUR: 23,
    START_MINUTE: 0,
    END_MINUTE: 59,
    START_SECOND: 0,
    END_SECOND: 59,
    START_FILE_INDEX: 0,
    MID_FILE_INDEX: 2,
    AVATAR: '/assets/avatar/default_avatar.png',
    NUMBER_MIN: 1,
    SIZE_LIMIT_MEDIUM: 25
  }
};

export default variables;

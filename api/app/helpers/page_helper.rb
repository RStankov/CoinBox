module PageHelper
  def page
    @page ||= PageBuilder.new(self)
  end

  class PageBuilder
    def initialize(template)
      @template = template
    end

    def title(value)
      @title = value
    end

    def title?
      @title.present?
    end

    def title_value
      @title
    end

    def breadcrumbs(*args)
      @breadcrumbs ||= []
      @breadcrumbs += args
    end

    def breadcrumbs?
      @breadcrumbs.present? && @title.present?
    end

    def breadcrumbs_value
      @breadcrumbs
    end

    def actions
      @actions = capture do
        yield.reverse
      end
    end

    def actions?
      @actions.present?
    end

    def actions_value
      @actionds
    end
  end
end
